import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { User, Notification } from '../../core/models/index';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="bg-white shadow-md h-16 flex items-center justify-between px-8 fixed top-0 left-64 right-0 z-40">
      <!-- Left Section -->
      <div class="flex items-center space-x-4">
        <h2 class="text-2xl font-bold text-gray-800">{{ getPageTitle() }}</h2>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-6">
        <button
          (click)="toggleTheme()"
          class="w-full px-4 py-3 rounded-lg hover:bg-gray-100   transition flex items-center space-x-3"
          [title]="isCollapsed() ? 'Toggle theme' : ''"
        >
          <span class="text-xl">🌙</span>
          @if (!isCollapsed()) {
            <span>Dark Mode</span>
          }
        </button>
        <!-- Notifications -->
        <div class="relative">

          <button
            (click)="toggleNotifications()"
            class="relative p-2 hover:bg-gray-100 rounded-lg transition"
            title="Notifications"
          >
            <span class="text-xl">🔔</span>
            @if (unreadCount() > 0) {
              <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ unreadCount() }}
              </span>
            }
          </button>

          <!-- Notifications Dropdown -->
          @if (showNotifications()) {
            <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl overflow-hidden z-50">
              <div class="p-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div class="max-h-96 overflow-y-auto">
                @if (notifications().length === 0) {
                  <div class="p-4 text-center text-gray-500">No notifications</div>
                } @else {
                  @for (notif of notifications(); track notif.id) {
                    <div
                      class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition flex items-start gap-3"
                      (click)="markAsRead(notif.id)"
                    >
                      <span class="text-xl mt-1">
                        @switch (notif.type) {
                          @case ('success') {
                            ✅
                          }
                          @case ('error') {
                            ❌
                          }
                          @case ('warning') {
                            ⚠️
                          }
                          @default {
                            ℹ️
                          }
                        }
                      </span>
                      <div class="flex-1">
                        <p class="font-semibold text-sm text-gray-800">{{ notif.title }}</p>
                        <p class="text-xs text-gray-600">{{ notif.message }}</p>
                      </div>
                      @if (!notif.read) {
                        <div class="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                      }
                    </div>
                  }
                }
              </div>
            </div>
          }
        </div>

        <!-- Profile Dropdown -->
        <div class="relative">
          <button
            (click)="toggleProfile()"
            class="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
            title="Profile"
          >
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
              {{ currentUser()?.name ? currentUser()!.name.charAt(0).toUpperCase() : 'U' }}
            </div>
            <div class="hidden md:block text-left text-sm">
              <p class="font-semibold text-gray-800">{{ currentUser()?.name }}</p>
              <p class="text-xs text-gray-600">{{ currentUser()?.email }}</p>
            </div>
            <span class="text-gray-600">▼</span>
          </button>

          <!-- Profile Dropdown Menu -->
          @if (showProfile()) {
            <div class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl overflow-hidden z-50">
              <div class="p-4 border-b border-gray-200">
                <p class="font-semibold text-gray-800">{{ currentUser()?.name }}</p>
                <p class="text-sm text-gray-600">{{ currentUser()?.email }}</p>
              </div>
              <div class="p-2">
                <button
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                >
                  👤 My Profile
                </button>
                <button
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                >
                  🔑 Change Password
                </button>
                <button
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                >
                  ⚙️ Settings
                </button>
              </div>
              <div class="p-2 border-t border-gray-200">
                <button
                  (click)="logout()"
                  class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private dataService = inject(DataService);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  notifications = signal<Notification[]>([]);
  showNotifications = signal(false);
  showProfile = signal(false);
  isCollapsed = signal(false);
  expandedMenus = signal({ hr: false, project: false, sales: false, employee: false });

  ngOnInit(): void {
    this.currentUser.set(this.authService.getCurrentUser());
    this.loadNotifications();
  }
  toggleSidebar(): void {
    this.isCollapsed.update((val) => !val);
  }

  toggleMenu(menu: string): void {
    this.expandedMenus.update((menus: any) => ({
      ...menus,
      [menu]: !menus[menu],
    }));
  }

  toggleTheme(): void {
    document.documentElement.classList.toggle('dark');
  }
  get unreadCount(): () => number {
    return () => this.notifications().filter((n) => !n.read).length;
  }

  loadNotifications(): void {
    const user = this.currentUser();
    if (user) {
      this.dataService.getNotifications(user.id).subscribe((notifs) => {
        this.notifications.set(notifs);
      });
    }
  }

  toggleNotifications(): void {
    this.showNotifications.update((v) => !v);
    this.showProfile.set(false);
  }

  toggleProfile(): void {
    this.showProfile.update((v) => !v);
    this.showNotifications.set(false);
  }

  markAsRead(notificationId: string): void {
    this.dataService.markNotificationAsRead(notificationId).subscribe();
    this.notifications.update((notifs) =>
      notifs.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getPageTitle(): string {
    const path = this.router.url;
    if (path.includes('dashboard')) return '📊 Dashboard';
    if (path.includes('employees')) return '👥 Employees';
    if (path.includes('leaves')) return '📅 Leaves';
    if (path.includes('attendance')) return '📋 Attendance';
    if (path.includes('projects')) return '📋 Projects';
    if (path.includes('tasks')) return '✅ Tasks';
    if (path.includes('leads')) return '💼 Leads';
    return '💼 Taracoder Management System';
  }
}

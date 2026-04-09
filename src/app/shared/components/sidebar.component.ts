import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { RoleService } from '../../core/services/role.service';
import { User, Notification } from '../../core/models/index';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside
      class="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-lg transform transition-transform duration-300"
      [class.w-20]="isCollapsed()"
      [class]-scale-x-100="false"
    >
      <!-- Header -->
      <div class="p-4 border-b border-blue-700 flex items-center justify-between">
        @if (!isCollapsed()) {
          <div>
            <h1 class="text-xl font-bold">💼 TMS</h1>
            <p class="text-xs text-blue-200">Management System</p>
          </div>
        }
        <button
          (click)="toggleSidebar()"
          class="p-2 hover:bg-blue-700 rounded-lg transition"
          title="Toggle sidebar"
        >
          @if (isCollapsed()) {
            <span>→</span>
          } @else {
            <span>←</span>
          }
        </button>
      </div>

      <!-- User Info -->
      <div class="p-4 border-b border-blue-700">
        @if (!isCollapsed()) {
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold">
              {{ currentUser()?.name ? currentUser()!.name.charAt(0).toUpperCase() : 'U' }}
            </div>
            <div class="flex-1">
              <p class="font-semibold text-sm">{{ currentUser()?.name }}</p>
              <p class="text-xs text-blue-200 capitalize">{{ roleService.getRoleName(currentUser()?.role!) }}</p>
            </div>
          </div>
        }
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto p-2">
        <div class="space-y-1">
          <!-- Dashboard -->
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-blue-600"
            class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
            [title]="isCollapsed() ? 'Dashboard' : ''"
          >
            <span class="text-xl">📊</span>
            @if (!isCollapsed()) {
              <span>Dashboard</span>
            }
          </a>

          <!-- HR Module -->
          @if (canAccess('hr')) {
            <button
              (click)="toggleMenu('hr')"
              class="w-full px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-between"
              [title]="isCollapsed() ? 'HR' : ''"
            >
              <div class="flex items-center space-x-3">
                <span class="text-xl">👥</span>
                @if (!isCollapsed()) {
                  <span>HR</span>
                }
              </div>
              @if (!isCollapsed()) {
                <span class="text-sm">{{ expandedMenus().hr ? '▼' : '▶' }}</span>
              }
            </button>
            @if (expandedMenus().hr && !isCollapsed()) {
              <div class="pl-4 space-y-1">
                <a
                  routerLink="/hr/employees"
                  routerLinkActive="bg-blue-600"
                  class="block px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition"
                >
                  Employees
                </a>
                <a
                  routerLink="/hr/leaves"
                  routerLinkActive="bg-blue-600"
                  class="block px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition"
                >
                  Leaves
                </a>
                <a
                  routerLink="/hr/attendance"
                  routerLinkActive="bg-blue-600"
                  class="block px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition"
                >
                  Attendance
                </a>
              </div>

            }
                <!-- Apply Leaves -->
                <a routerLink="/employee/leaves" routerLinkActive="bg-blue-600"
                  class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                  [title]="isCollapsed() ? 'Apply Leaves' : ''">
                  <span class="text-xl">🏖️</span>
                  @if (!isCollapsed()) { <span>Apply Leaves</span> }
                </a>

                <!-- Referral -->
                <a routerLink="/employee/referral" routerLinkActive="bg-blue-600"
                  class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                  [title]="isCollapsed() ? 'Referral' : ''">
                  <span class="text-xl">🤝</span>
                  @if (!isCollapsed()) { <span>Referral</span> }
                </a>

                <!-- Documents -->
                <a routerLink="/employee/documents" routerLinkActive="bg-blue-600"
                  class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                  [title]="isCollapsed() ? 'Documents' : ''">
                  <span class="text-xl">📄</span>
                  @if (!isCollapsed()) { <span>Documents</span> }
                </a>

                <!-- Help Desk -->
                <a routerLink="/employee/helpdesk" routerLinkActive="bg-blue-600"
                  class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                  [title]="isCollapsed() ? 'Help Desk' : ''">
                  <span class="text-xl">🎧</span>
                  @if (!isCollapsed()) { <span>Help Desk</span> }
                </a>

                <!-- Quick Links -->
                <a routerLink="/employee/quicklinks" routerLinkActive="bg-blue-600"
                  class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                  [title]="isCollapsed() ? 'Quick Links' : ''">
                  <span class="text-xl">🔗</span>
                  @if (!isCollapsed()) { <span>Quick Links</span> }
                </a>

                <!-- People -->
                <a routerLink="/employee/people" routerLinkActive="bg-blue-600"
                  class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                  [title]="isCollapsed() ? 'People' : ''">
                  <span class="text-xl">👥</span>
                  @if (!isCollapsed()) { <span>People</span> }
                </a>

                <!-- To-Do -->
                <a routerLink="/employee/todo" routerLinkActive="bg-blue-600"
                  class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                  [title]="isCollapsed() ? 'To-Do' : ''">
                  <span class="text-xl">✅</span>
                  @if (!isCollapsed()) { <span>To-Do</span> }
                </a>
          }

          <!-- Project Module -->
          @if (canAccess('pm')) {
            <button
              (click)="toggleMenu('project')"
              class="w-full px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-between"
              [title]="isCollapsed() ? 'Projects' : ''"
            >
              <div class="flex items-center space-x-3">
                <span class="text-xl">📋</span>
                @if (!isCollapsed()) {
                  <span>Projects</span>
                }
              </div>
              @if (!isCollapsed()) {
                <span class="text-sm">{{ expandedMenus().project ? '▼' : '▶' }}</span>
              }
            </button>
            @if (expandedMenus().project && !isCollapsed()) {
              <div class="pl-4 space-y-1">
                <a
                  routerLink="/project/projects"
                  routerLinkActive="bg-blue-600"
                  class="block px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition"
                >
                  Projects
                </a>
                <a
                  routerLink="/project/tasks"
                  routerLinkActive="bg-blue-600"
                  class="block px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition"
                >
                  Tasks
                </a>

              </div>

            }
                  <!-- Apply Leaves -->
                  <a routerLink="/employee/leaves" routerLinkActive="bg-blue-600"
                    class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                    [title]="isCollapsed() ? 'Apply Leaves' : ''">
                    <span class="text-xl">🏖️</span>
                    @if (!isCollapsed()) { <span>Apply Leaves</span> }
                  </a>

                  <!-- Referral -->
                  <a routerLink="/employee/referral" routerLinkActive="bg-blue-600"
                    class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                    [title]="isCollapsed() ? 'Referral' : ''">
                    <span class="text-xl">🤝</span>
                    @if (!isCollapsed()) { <span>Referral</span> }
                  </a>

                  <!-- Documents -->
                  <a routerLink="/employee/documents" routerLinkActive="bg-blue-600"
                    class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                    [title]="isCollapsed() ? 'Documents' : ''">
                    <span class="text-xl">📄</span>
                    @if (!isCollapsed()) { <span>Documents</span> }
                  </a>

                  <!-- Help Desk -->
                  <a routerLink="/employee/helpdesk" routerLinkActive="bg-blue-600"
                    class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                    [title]="isCollapsed() ? 'Help Desk' : ''">
                    <span class="text-xl">🎧</span>
                    @if (!isCollapsed()) { <span>Help Desk</span> }
                  </a>

                  <!-- Quick Links -->
                  <a routerLink="/employee/quicklinks" routerLinkActive="bg-blue-600"
                    class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                    [title]="isCollapsed() ? 'Quick Links' : ''">
                    <span class="text-xl">🔗</span>
                    @if (!isCollapsed()) { <span>Quick Links</span> }
                  </a>

                  <!-- People -->
                  <a routerLink="/employee/people" routerLinkActive="bg-blue-600"
                    class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                    [title]="isCollapsed() ? 'People' : ''">
                    <span class="text-xl">👥</span>
                    @if (!isCollapsed()) { <span>People</span> }
                  </a>

                  <!-- To-Do -->
                  <a routerLink="/employee/todo" routerLinkActive="bg-blue-600"
                    class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
                    [title]="isCollapsed() ? 'To-Do' : ''">
                    <span class="text-xl">✅</span>
                    @if (!isCollapsed()) { <span>To-Do</span> }
                  </a>
          }

          <!-- Sales Module -->
          @if (canAccess('sales')) {
            <button
              (click)="toggleMenu('sales')"
              class="w-full px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-between"
              [title]="isCollapsed() ? 'Sales' : ''"
            >
              <div class="flex items-center space-x-3">
                <span class="text-xl">💰</span>
                @if (!isCollapsed()) {
                  <span>Sales</span>
                }
              </div>
              @if (!isCollapsed()) {
                <span class="text-sm">{{ expandedMenus().sales ? '▼' : '▶' }}</span>
              }
            </button>
            @if (expandedMenus().sales && !isCollapsed()) {
              <div class="pl-4 space-y-1">
                <a
                  routerLink="/sales/leads"
                  routerLinkActive="bg-blue-600"
                  class="block px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition"
                >
                  Leads
                </a>
              </div>

            }
            <!-- Apply Leaves -->
            <a routerLink="/employee/leaves" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'Apply Leaves' : ''">
              <span class="text-xl">🏖️</span>
              @if (!isCollapsed()) { <span>Apply Leaves</span> }
            </a>

            <!-- Referral -->
            <a routerLink="/employee/referral" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'Referral' : ''">
              <span class="text-xl">🤝</span>
              @if (!isCollapsed()) { <span>Referral</span> }
            </a>

            <!-- Documents -->
            <a routerLink="/employee/documents" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'Documents' : ''">
              <span class="text-xl">📄</span>
              @if (!isCollapsed()) { <span>Documents</span> }
            </a>

            <!-- Help Desk -->
            <a routerLink="/employee/helpdesk" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'Help Desk' : ''">
              <span class="text-xl">🎧</span>
              @if (!isCollapsed()) { <span>Help Desk</span> }
            </a>

            <!-- Quick Links -->
            <a routerLink="/employee/quicklinks" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'Quick Links' : ''">
              <span class="text-xl">🔗</span>
              @if (!isCollapsed()) { <span>Quick Links</span> }
            </a>

            <!-- People -->
            <a routerLink="/employee/people" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'People' : ''">
              <span class="text-xl">👥</span>
              @if (!isCollapsed()) { <span>People</span> }
            </a>

            <!-- To-Do -->
            <a routerLink="/employee/todo" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'To-Do' : ''">
              <span class="text-xl">✅</span>
              @if (!isCollapsed()) { <span>To-Do</span> }
            </a>
          }

          <!-- Employee Module -->
          @if (currentUser()?.role === 'developer' || currentUser()?.role === 'tl') {

            <!-- My Profile -->
            <a routerLink="/employee/profile" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'My Profile' : ''">
              <span class="text-xl">👤</span>
              @if (!isCollapsed()) { <span>My Profile</span> }
            </a>

            <!-- Apply Leaves -->
            <a routerLink="/employee/leaves" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'Apply Leaves' : ''">
              <span class="text-xl">🏖️</span>
              @if (!isCollapsed()) { <span>Apply Leaves</span> }
            </a>

            <!-- Referral -->
            <a routerLink="/employee/referral" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'Referral' : ''">
              <span class="text-xl">🤝</span>
              @if (!isCollapsed()) { <span>Referral</span> }
            </a>

            <!-- Documents -->
            <a routerLink="/employee/documents" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'Documents' : ''">
              <span class="text-xl">📄</span>
              @if (!isCollapsed()) { <span>Documents</span> }
            </a>

            <!-- Help Desk -->
            <a routerLink="/employee/helpdesk" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'Help Desk' : ''">
              <span class="text-xl">🎧</span>
              @if (!isCollapsed()) { <span>Help Desk</span> }
            </a>

            <!-- Quick Links -->
            <a routerLink="/employee/quicklinks" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'Quick Links' : ''">
              <span class="text-xl">🔗</span>
              @if (!isCollapsed()) { <span>Quick Links</span> }
            </a>

            <!-- People -->
            <a routerLink="/employee/people" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'People' : ''">
              <span class="text-xl">👥</span>
              @if (!isCollapsed()) { <span>People</span> }
            </a>

            <!-- To-Do -->
            <a routerLink="/employee/todo" routerLinkActive="bg-blue-600"
              class="block px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-3"
              [title]="isCollapsed() ? 'To-Do' : ''">
              <span class="text-xl">✅</span>
              @if (!isCollapsed()) { <span>To-Do</span> }
            </a>

          }
        </div>
      </nav>

      <!-- Settings & Logout -->
      <div class="p-2 border-t border-blue-700 space-y-1">

        <button
          (click)="logout()"
          class="w-full px-4 py-3 rounded-lg hover:bg-red-600 transition flex items-center space-x-3 text-red-100"
          [title]="isCollapsed() ? 'Logout' : ''"
        >
          <span class="text-xl">🚪</span>
          @if (!isCollapsed()) {
            <span>Logout</span>
          }
        </button>
      </div>
    </aside>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  roleService = inject(RoleService);
  private dataService = inject(DataService);

  currentUser = signal<User | null>(null);
  isCollapsed = signal(false);
  expandedMenus = signal({ hr: false, project: false, sales: false, employee: false });

  constructor() {
    this.currentUser.set(this.authService.getCurrentUser());
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

  canAccess(module: string): boolean {
    const user = this.currentUser();
    if (!user) return false;

    const accessMap: Record<string, string[]> = {
      hr: ['super-admin', 'admin', 'hr', 'pm', 'tl'],
      project: ['super-admin', 'admin', 'pm', 'tl', 'developer'],
      sales: ['super-admin', 'admin', 'sm', 'sales'],
      employee: ['developer', 'tl', 'pm'],
    };

    return accessMap[module]?.includes(user.role) || false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

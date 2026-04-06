import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar.component';
import { NavbarComponent } from './shared/components/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SidebarComponent, NavbarComponent],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      @if (isAuthenticated() && !isLoginPage()) {
        <app-sidebar />
      }

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col" [class.ml-64]="isAuthenticated() && !isLoginPage()" [class.ml-20]="false">
        <!-- Navbar -->
        @if (isAuthenticated() && !isLoginPage()) {
          <app-navbar />
        }

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto" [class.mt-16]="isAuthenticated() && !isLoginPage()">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class App {
  private authService = inject(AuthService);

  isAuthenticated = this.authService.isAuthenticatedSignal;

  get isLoginPage(): () => boolean {
    return () => window.location.pathname.includes('/auth/login');
  }

  constructor() {
    effect(() => {
      const isDarkMode = localStorage.getItem('theme') === 'dark';
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      }
    });
  }
}

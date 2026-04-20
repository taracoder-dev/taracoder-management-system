import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/index';

interface DemoAccount {
  role: UserRole;
  email: string;
  password: string;
  fullName: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center p-4 relative">
      <!-- Main Content -->

      <div class="w-full max-w-4xl z-10">
        <!-- Main Login Container -->
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            <!-- Left Side - Branding -->
            <div class="bg-gradient-to-br from-blue-600 to-indigo-900 p-12 text-white flex flex-col justify-between hidden md:flex">
              <div>
                <h1 class="text-4xl font-bold mb-4">💼 TMS</h1>
                <h2 class="text-3xl font-bold mb-4">Taracoder</h2>
                <p class="text-blue-100 mb-8">Management System</p>
                <p class="text-blue-100 leading-relaxed">
                  Streamline your enterprise operations with intelligent role-based access control, real-time analytics, and seamless team collaboration.
                </p>
              </div>
              <div class="text-blue-100 text-sm">
                <p class="font-semibold mb-2">Built with:</p>
                <p>✓ Angular 21 + TypeScript</p>
                <p>✓ Modern Responsive Design</p>
                <p>✓ Enterprise Security</p>
              </div>
            </div>

            <!-- Right Side - Login Form -->
            <div class="p-8 md:p-12">
              <div class="mb-8 text-center">
                <h3 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h3>
                <p class="text-gray-600">Sign in to your account to continue</p>
              </div>

              <!-- Error Message Display -->
              @if (errorPopupMessage) {
                <div class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm flex items-start">
                  <span class="text-red-600 text-xl mr-3">⚠️</span>
                  <div>
                    <h4 class="text-red-800 font-bold">Login Failed</h4>
                    <p class="text-red-700 mt-1">{{ errorPopupMessage }}</p>
                  </div>
                </div>
              }

              <!-- Login Form -->
              <form (ngSubmit)="login()" class="space-y-4 mb-8">
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    placeholder="Enter your email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    [disabled]="isLoading"
                  />
                </div>

                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    [(ngModel)]="password"
                    name="password"
                    placeholder="Enter your password"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    [disabled]="isLoading"
                    (keyup.enter)="login()"
                  />
                </div>

                <button
                  type="submit"
                  class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  [disabled]="isLoading || !email || !password"
                >
                  {{ isLoading ? 'Signing In...' : 'Sign In' }}
                </button>
              </form>

              <!-- Demo Accounts Section -->
              <div class="border-t border-gray-200 pt-8">
                <p class="text-gray-600 text-sm font-semibold mb-4">Demo Accounts (for testing):</p>
                <div class="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  @for (account of demoAccounts; track account.email) {
                    <button
                      type="button"
                      (click)="fillDemoAccount(account)"
                      class="p-3 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-sm"
                      [disabled]="isLoading"
                    >
                      <div class="font-semibold text-gray-900">{{ account.fullName }}</div>
                      <div class="text-gray-600 text-xs truncate">{{ account.email }}</div>
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="text-center mt-8 text-white text-sm">
          <p>© 2026 Taracoder. All rights reserved. | Designed & Developed with ❤️ by Taracoder</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  isLoading = false;
  errorPopupMessage = '';

  demoAccounts: DemoAccount[] = [
    {
      role: 'super-admin',
      email: 'super@taracoder.com',
      password: '123456',
      fullName: '👑 Super Admin',
    },
    {
      role: 'admin',
      email: 'admin@taracoder.com',
      password: '123456',
      fullName: '🛠️ Admin',
    },
    {
      role: 'hr',
      email: 'hr@taracoder.com',
      password: '123456',
      fullName: '👨‍💼 HR Manager',
    },
    {
      role: 'pm',
      email: 'pm@taracoder.com',
      password: '123456',
      fullName: '📋 Project Manager',
    },
    {
      role: 'tl',
      email: 'tl@taracoder.com',
      password: '123456',
      fullName: '🧑‍🏫 Team Leader',
    },
    {
      role: 'developer',
      email: 'dev@taracoder.com',
      password: '123456',
      fullName: '👨‍💻 Developer',
    },
    {
      role: 'sm',
      email: 'sm@taracoder.com',
      password: '123456',
      fullName: '💰 Sales Manager',
    },
    {
      role: 'sales',
      email: 'sales@taracoder.com',
      password: '123456',
      fullName: '📞 Sales Team',
    },
  ];

  login(): void {
    if (!this.email || !this.password) {
      this.errorPopupMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (result) => {
        if (result) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Login API Error:', err);
        let extractedMessage = 'Invalid email or password';
        
        if (err.error) {
          if (typeof err.error === 'string') {
            try {
              const parsed = JSON.parse(err.error);
              extractedMessage = parsed.message || parsed.error || extractedMessage;
            } catch (e) {
              extractedMessage = err.error;
            }
          } else if (err.error.message) {
            extractedMessage = err.error.message;
          } else if (err.error.error) {
            extractedMessage = err.error.error;
          }
        }
        
        this.errorPopupMessage = extractedMessage;
        this.isLoading = false;
      }
    });
  }

  clearError(): void {
    this.errorPopupMessage = '';
  }

  fillDemoAccount(account: DemoAccount): void {
    this.email = account.email;
    this.password = account.password;
  }
}

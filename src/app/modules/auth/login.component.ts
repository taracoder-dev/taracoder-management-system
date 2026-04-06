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
    name: string;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center p-4">
      <div class="w-full max-w-4xl">
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

              <!-- Error Message -->
              @if (error) {
                <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {{ error }}
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
                      <div class="font-semibold text-gray-900">{{ account.name }}</div>
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
          <p>🔐 This is a demo application with mock authentication</p>
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
    error = '';
    isLoading = false;

    demoAccounts: DemoAccount[] = [
        {
            role: 'super-admin',
            email: 'super@taracoder.com',
            password: '123456',
            name: '👑 Super Admin',
        },
        {
            role: 'admin',
            email: 'admin@taracoder.com',
            password: '123456',
            name: '🛠️ Admin',
        },
        {
            role: 'hr',
            email: 'hr@taracoder.com',
            password: '123456',
            name: '👨‍💼 HR Manager',
        },
        {
            role: 'pm',
            email: 'pm@taracoder.com',
            password: '123456',
            name: '📋 Project Manager',
        },
        {
            role: 'tl',
            email: 'tl@taracoder.com',
            password: '123456',
            name: '🧑‍🏫 Team Leader',
        },
        {
            role: 'developer',
            email: 'dev@taracoder.com',
            password: '123456',
            name: '👨‍💻 Developer',
        },
        {
            role: 'sm',
            email: 'sm@taracoder.com',
            password: '123456',
            name: '💰 Sales Manager',
        },
        {
            role: 'sales',
            email: 'sales@taracoder.com',
            password: '123456',
            name: '📞 Sales Team',
        },
    ];

    login(): void {
        if (!this.email || !this.password) {
            this.error = 'Please enter both email and password';
            return;
        }

        this.isLoading = true;
        this.error = '';

        // Simulate API delay
        setTimeout(() => {
            const result = this.authService.login({ email: this.email, password: this.password });

            if (result) {
                this.router.navigate(['/dashboard']);
            } else {
                this.error = 'Invalid email or password';
                this.isLoading = false;
            }
        }, 500);
    }

    fillDemoAccount(account: DemoAccount): void {
        this.email = account.email;
        this.password = account.password;
    }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-2xl p-12 text-center max-w-md">
        <h1 class="text-6xl font-bold text-red-600 mb-4">🚫</h1>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p class="text-gray-600 mb-6">
          You do not have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div class="space-y-3">
          <a
            routerLink="/dashboard"
            class="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Go to Dashboard
          </a>
          <a
            routerLink="/auth/login"
            class="block bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-lg transition"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  `,
})
export class UnauthorizedComponent { }

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { User, DashboardStats } from '../../core/models/index';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-8 space-y-8">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 shadow-lg">
        <h1 class="text-3xl font-bold mb-2">Welcome, {{ currentUser()?.fullName }}! 👋</h1>
        <p class="text-blue-100">{{ getGreeting() }}</p>
      </div>

      <!-- Role-Specific Dashboard Content -->
      @switch (currentUser()?.role) {
        @case ('super-admin') {
          <div class="space-y-6">
            <!-- KPI Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Users</h3>
                <p class="text-3xl font-bold text-gray-900">45</p>
                <p class="text-green-600 text-sm mt-2">↑ All Active</p>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 class="text-gray-500 text-sm font-semibold mb-2">Active Projects</h3>
                <p class="text-3xl font-bold text-gray-900">12</p>
                <p class="text-green-600 text-sm mt-2">↑ System Wide</p>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <h3 class="text-gray-500 text-sm font-semibold mb-2">Pending Approvals</h3>
                <p class="text-3xl font-bold text-gray-900">8</p>
                <p class="text-orange-600 text-sm mt-2">Requires Action</p>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <h3 class="text-gray-500 text-sm font-semibold mb-2">System Health</h3>
                <p class="text-3xl font-bold text-green-600">99.8%</p>
                <p class="text-green-600 text-sm mt-2">🟢 Operational</p>
              </div>
            </div>
          </div>
        }
        @case ('admin') {
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Employees</h3>
              <p class="text-3xl font-bold text-gray-900">45</p>
              <p class="text-green-600 text-sm mt-2">↑ 3 Active</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">System Usage</h3>
              <p class="text-3xl font-bold text-gray-900">92%</p>
              <p class="text-gray-600 text-sm mt-2">Last 24 hours</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">New Requests</h3>
              <p class="text-3xl font-bold text-gray-900">12</p>
              <p class="text-orange-600 text-sm mt-2">Pending</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Departments</h3>
              <p class="text-3xl font-bold text-gray-900">8</p>
              <p class="text-green-600 text-sm mt-2">Operational</p>
            </div>
          </div>
        }
        @case ('hr') {
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Active Employees</h3>
              <p class="text-3xl font-bold text-gray-900">42</p>
              <p class="text-green-600 text-sm mt-2">3 on leave</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Pending Leaves</h3>
              <p class="text-3xl font-bold text-gray-900">5</p>
              <p class="text-orange-600 text-sm mt-2">Awaiting</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Attendance</h3>
              <p class="text-3xl font-bold text-gray-900">94%</p>
              <p class="text-green-600 text-sm mt-2">This month</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Reviews Due</h3>
              <p class="text-3xl font-bold text-gray-900">8</p>
              <p class="text-orange-600 text-sm mt-2">This week</p>
            </div>
          </div>
        }
        @case ('pm') {
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Active Projects</h3>
              <p class="text-3xl font-bold text-gray-900">5</p>
              <p class="text-green-600 text-sm mt-2">On track</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Tasks Today</h3>
              <p class="text-3xl font-bold text-gray-900">12</p>
              <p class="text-gray-600 text-sm mt-2">Assigned</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Budget Used</h3>
              <p class="text-3xl font-bold text-gray-900">68%</p>
              <p class="text-green-600 text-sm mt-2">On target</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Team Members</h3>
              <p class="text-3xl font-bold text-gray-900">8</p>
              <p class="text-gray-600 text-sm mt-2">Available</p>
            </div>
          </div>
        }
        @case ('tl') {
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Team Members</h3>
              <p class="text-3xl font-bold text-gray-900">6</p>
              <p class="text-green-600 text-sm mt-2">All active</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Tasks Done</h3>
              <p class="text-3xl font-bold text-gray-900">28</p>
              <p class="text-green-600 text-sm mt-2">This sprint</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Leave Requests</h3>
              <p class="text-3xl font-bold text-gray-900">2</p>
              <p class="text-orange-600 text-sm mt-2">Pending</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Performance</h3>
              <p class="text-3xl font-bold text-gray-900">4.6★</p>
              <p class="text-yellow-600 text-sm mt-2">Excellent</p>
            </div>
          </div>
        }
        @case ('developer') {
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">My Tasks</h3>
              <p class="text-3xl font-bold text-gray-900">4</p>
              <p class="text-orange-600 text-sm mt-2">In progress</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Completed</h3>
              <p class="text-3xl font-bold text-gray-900">12</p>
              <p class="text-green-600 text-sm mt-2">This month</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Leave Balance</h3>
              <p class="text-3xl font-bold text-gray-900">8</p>
              <p class="text-purple-600 text-sm mt-2">Days left</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Hours Logged</h3>
              <p class="text-3xl font-bold text-gray-900">156</p>
              <p class="text-indigo-600 text-sm mt-2">This month</p>
            </div>
          </div>
        }
        @case ('sm') {
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Leads</h3>
              <p class="text-3xl font-bold text-gray-900">89</p>
              <p class="text-blue-600 text-sm mt-2">Active</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Conversions</h3>
              <p class="text-3xl font-bold text-gray-900">23</p>
              <p class="text-green-600 text-sm mt-2">This month</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Pipeline Value</h3>
              <p class="text-3xl font-bold text-gray-900">$125K</p>
              <p class="text-purple-600 text-sm mt-2">Qualified</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Team Size</h3>
              <p class="text-3xl font-bold text-gray-900">5</p>
              <p class="text-yellow-600 text-sm mt-2">Members</p>
            </div>
          </div>
        }
        @case ('sales') {
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">My Leads</h3>
              <p class="text-3xl font-bold text-gray-900">24</p>
              <p class="text-blue-600 text-sm mt-2">Assigned</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Conversions</h3>
              <p class="text-3xl font-bold text-gray-900">6</p>
              <p class="text-green-600 text-sm mt-2">This month</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Follow-ups</h3>
              <p class="text-3xl font-bold text-gray-900">4</p>
              <p class="text-orange-600 text-sm mt-2">Pending</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 class="text-gray-500 text-sm font-semibold mb-2">Commission</h3>
              <p class="text-3xl font-bold text-gray-900">$4.8K</p>
              <p class="text-yellow-600 text-sm mt-2">Earned</p>
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class DashboardComponent {
    private authService = inject(AuthService);
    currentUser = signal<User | null>(null);

    constructor() {
        this.currentUser.set(this.authService.getCurrentUser());
    }

    getGreeting(): string {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning! Ready to conquer the day?';
        if (hour < 18) return 'Good afternoon! Keep up the momentum!';
        return 'Good evening! Great work today!';
    }
}

// Super Admin Dashboard
@Component({
    selector: 'app-super-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Users</h3>
          <p class="text-3xl font-bold text-gray-900">{{ (stats() | json) }}</p>
          <p class="text-green-600 text-sm mt-2">↑ All Roles Visible</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Active Projects</h3>
          <p class="text-3xl font-bold text-gray-900">{{ stats().activeProjects ?? 0 }}</p>
          <p class="text-green-600 text-sm mt-2">↑ System Wide</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Pending Approvals</h3>
          <p class="text-3xl font-bold text-gray-900">{{ stats().pendingLeaves ?? 0 }}</p>
          <p class="text-orange-600 text-sm mt-2">Requires Action</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">System Health</h3>
          <p class="text-3xl font-bold text-green-600">99.8%</p>
          <p class="text-green-600 text-sm mt-2">🟢 All Systems Operational</p>
        </div>
      </div>

      <!-- Quick Actions & Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-bold text-gray-900 mb-4">📊 System Analytics</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-600">Employee Onboarding</span>
                <span class="text-sm font-semibold text-gray-900">85%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 85%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-600">Project Completion</span>
                <span class="text-sm font-semibold text-gray-900">72%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" style="width: 72%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-600">Sales Target</span>
                <span class="text-sm font-semibold text-gray-900">65%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-purple-600 h-2 rounded-full" style="width: 65%"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-bold text-gray-900 mb-4">🔐 Permissions</h3>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-lg">✓</span>
              <span>Manage All Users</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-lg">✓</span>
              <span>Assign Roles</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-lg">✓</span>
              <span>View Analytics</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-lg">✓</span>
              <span>System Settings</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-lg">✓</span>
              <span>Activity Logs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SuperAdminDashboardComponent {
    private dataService = inject(DataService);
    stats = signal<DashboardStats>({
        totalEmployees: 45,
        activeProjects: 12,
        pendingLeaves: 8,
        completedTasks: 156,
        totalLeads: 89,
        convertedLeads: 23,
    });
}

// Admin Dashboard
@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Employees</h3>
          <p class="text-3xl font-bold text-gray-900">45</p>
          <p class="text-green-600 text-sm mt-2">↑ 3 Active Today</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">System Usage</h3>
          <p class="text-3xl font-bold text-gray-900">92%</p>
          <p class="text-gray-600 text-sm mt-2">Last 24 hours</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">New Requests</h3>
          <p class="text-3xl font-bold text-gray-900">12</p>
          <p class="text-orange-600 text-sm mt-2">Pending Review</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Dept. Active</h3>
          <p class="text-3xl font-bold text-gray-900">8</p>
          <p class="text-green-600 text-sm mt-2">All Operational</p>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent { }

// HR Dashboard
@Component({
    selector: 'app-hr-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Active Employees</h3>
          <p class="text-3xl font-bold text-gray-900">42</p>
          <p class="text-green-600 text-sm mt-2">3 On Leave</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Pending Leaves</h3>
          <p class="text-3xl font-bold text-gray-900">8</p>
          <p class="text-orange-600 text-sm mt-2">Waiting Approval</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Attendance Rate</h3>
          <p class="text-3xl font-bold text-gray-900">96%</p>
          <p class="text-green-600 text-sm mt-2">Current Month</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Reviews Due</h3>
          <p class="text-3xl font-bold text-gray-900">5</p>
          <p class="text-red-600 text-sm mt-2">This Month</p>
        </div>
      </div>
    </div>
  `,
})
export class HRDashboardComponent { }

// Project Manager Dashboard
@Component({
    selector: 'app-pm-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Active Projects</h3>
          <p class="text-3xl font-bold text-gray-900">5</p>
          <p class="text-green-600 text-sm mt-2">2 On Track</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Completed Tasks</h3>
          <p class="text-3xl font-bold text-gray-900">42</p>
          <p class="text-gray-600 text-sm mt-2">This Month</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">In Progress</h3>
          <p class="text-3xl font-bold text-gray-900">18</p>
          <p class="text-blue-600 text-sm mt-2">Team Members</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Budget Used</h3>
          <p class="text-3xl font-bold text-gray-900">65%</p>
          <p class="text-green-600 text-sm mt-2">On Budget</p>
        </div>
      </div>
    </div>
  `,
})
export class PMDashboardComponent { }

// Team Leader Dashboard
@Component({
    selector: 'app-tl-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Team Members</h3>
          <p class="text-3xl font-bold text-gray-900">8</p>
          <p class="text-green-600 text-sm mt-2">All Active</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Tasks Completed</h3>
          <p class="text-3xl font-bold text-gray-900">24</p>
          <p class="text-gray-600 text-sm mt-2">This Week</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Leave Requests</h3>
          <p class="text-3xl font-bold text-gray-900">3</p>
          <p class="text-orange-600 text-sm mt-2">Pending</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Avg Performance</h3>
          <p class="text-3xl font-bold text-gray-900">4.3★</p>
          <p class="text-green-600 text-sm mt-2">Out of 5</p>
        </div>
      </div>
    </div>
  `,
})
export class TLDashboardComponent { }

// Developer Dashboard
@Component({
    selector: 'app-developer-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">My Tasks</h3>
          <p class="text-3xl font-bold text-gray-900">7</p>
          <p class="text-blue-600 text-sm mt-2">2 Urgent</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Completed</h3>
          <p class="text-3xl font-bold text-gray-900">18</p>
          <p class="text-gray-600 text-sm mt-2">This Month</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Leave Balance</h3>
          <p class="text-3xl font-bold text-gray-900">12</p>
          <p class="text-gray-600 text-sm mt-2">Days Available</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Hours Logged</h3>
          <p class="text-3xl font-bold text-gray-900">152</p>
          <p class="text-gray-600 text-sm mt-2">This Month</p>
        </div>
      </div>
    </div>
  `,
})
export class DeveloperDashboardComponent { }

// Sales Manager Dashboard
@Component({
    selector: 'app-sales-manager-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Leads</h3>
          <p class="text-3xl font-bold text-gray-900">89</p>
          <p class="text-blue-600 text-sm mt-2">This Month</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Conversions</h3>
          <p class="text-3xl font-bold text-gray-900">23</p>
          <p class="text-green-600 text-sm mt-2">25.8% Rate</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Revenue</h3>
          <p class="text-3xl font-bold text-gray-900">$2.3M</p>
          <p class="text-gray-600 text-sm mt-2">Pipeline Value</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Team Members</h3>
          <p class="text-3xl font-bold text-gray-900">12</p>
          <p class="text-gray-600 text-sm mt-2">Active</p>
        </div>
      </div>
    </div>
  `,
})
export class SalesManagerDashboardComponent { }

// Sales Team Dashboard
@Component({
    selector: 'app-sales-team-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">My Leads</h3>
          <p class="text-3xl font-bold text-gray-900">12</p>
          <p class="text-blue-600 text-sm mt-2">3 Qualified</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Conversions</h3>
          <p class="text-3xl font-bold text-gray-900">3</p>
          <p class="text-green-600 text-sm mt-2">This Month</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Follow-ups</h3>
          <p class="text-3xl font-bold text-gray-900">5</p>
          <p class="text-orange-600 text-sm mt-2">Pending</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Salary Slip</h3>
          <p class="text-3xl font-bold text-gray-900">$5.5K</p>
          <p class="text-gray-600 text-sm mt-2">Basic + Commission</p>
        </div>
      </div>
    </div>
  `,
})
export class SalesTeamDashboardComponent { }

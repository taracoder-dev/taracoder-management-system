import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RoleService } from '../../core/services/role.service';
import { DataService } from '../../core/services/data.service';
import { User, SalarySlip, Leave, Attendance } from '../../core/models/index';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table.component';

@Component({
    selector: 'app-employee-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, DataTableComponent],
    template: `
    <div class="p-8 space-y-8">
      <!-- User Profile Section -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 shadow-lg">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">{{ currentUser()?.name ?? 'User' }}</h1>
            <p class="text-blue-100 text-lg mb-4">{{ currentUser()?.role ? roleService.getRoleName(currentUser()!.role) : 'Unknown' }}</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p class="text-blue-100">Email</p>
                <p class="font-semibold">{{ currentUser()?.email }}</p>
              </div>
              <div>
                <p class="text-blue-100">Department</p>
                <p class="font-semibold">{{ currentUser()?.department }}</p>
              </div>
              <div>
                <p class="text-blue-100">Join Date</p>
                <p class="font-semibold">{{ currentUser()?.joinDate }}</p>
              </div>
              <div>
                <p class="text-blue-100">Phone</p>
                <p class="font-semibold">{{ currentUser()?.phone }}</p>
              </div>
            </div>
          </div>
          <div class="w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center text-4xl font-bold">
            @if (currentUser()?.name) {
              {{ currentUser()!.name.charAt(0).toUpperCase() }}
            }
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Leaves Balance</h3>
          <p class="text-3xl font-bold text-gray-900">12</p>
          <p class="text-gray-600 text-sm mt-2">Days Available</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Attendance</h3>
          <p class="text-3xl font-bold text-green-600">96%</p>
          <p class="text-gray-600 text-sm mt-2">This Month</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Tasks Completed</h3>
          <p class="text-3xl font-bold text-purple-600">42</p>
          <p class="text-gray-600 text-sm mt-2">This Month</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Performance</h3>
          <p class="text-3xl font-bold text-orange-600">4.5★</p>
          <p class="text-gray-600 text-sm mt-2">Out of 5</p>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="flex border-b border-gray-200">
          <button
            (click)="activeTab.set('leaves')"
            [class.bg-blue-50]="activeTab() === 'leaves'"
            [class.border-b-2]="activeTab() === 'leaves'"
            [class.border-blue-600]="activeTab() === 'leaves'"
            class="flex-1 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            📅 My Leaves
          </button>
          <button
            (click)="activeTab.set('attendance')"
            [class.bg-blue-50]="activeTab() === 'attendance'"
            [class.border-b-2]="activeTab() === 'attendance'"
            [class.border-blue-600]="activeTab() === 'attendance'"
            class="flex-1 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            ✓ Attendance
          </button>
          <button
            (click)="activeTab.set('salary')"
            [class.bg-blue-50]="activeTab() === 'salary'"
            [class.border-b-2]="activeTab() === 'salary'"
            [class.border-blue-600]="activeTab() === 'salary'"
            class="flex-1 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            💰 Salary
          </button>
          <button
            (click)="activeTab.set('documents')"
            [class.bg-blue-50]="activeTab() === 'documents'"
            [class.border-b-2]="activeTab() === 'documents'"
            [class.border-blue-600]="activeTab() === 'documents'"
            class="flex-1 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            📄 Documents
          </button>
        </div>

        <div class="p-6">
          @if (activeTab() === 'leaves') {
            <div class="space-y-4">
              <app-data-table
                [data]="userLeaves()"
                [columns]="leaveColumns"
                [tableConfig]="{ showPagination: true, showSearch: true }"
              />
            </div>
          }

          @if (activeTab() === 'attendance') {
            <div class="space-y-4">
              <app-data-table
                [data]="userAttendance()"
                [columns]="attendanceColumns"
                [tableConfig]="{ showPagination: true, showSearch: true }"
              />
            </div>
          }

          @if (activeTab() === 'salary') {
            <div class="space-y-4">
              <app-data-table
                [data]="userSalarySlips()"
                [columns]="salaryColumns"
                [tableConfig]="{ showPagination: true, showSearch: true }"
                [rowActionsData]="[{label: 'Download', type: 'primary'}]"
              />
            </div>
          }

          @if (activeTab() === 'documents') {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:bg-gray-50 cursor-pointer transition">
                <p class="text-2xl mb-2">📁</p>
                <p class="font-semibold text-gray-700">Upload Document</p>
                <p class="text-sm text-gray-500">Drag and drop or click to upload</p>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Account Settings -->
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">⚙️ Account Settings</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button class="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left">
            <p class="font-semibold text-gray-900">🔑 Change Password</p>
            <p class="text-sm text-gray-600 mt-1">Update your password regularly for security</p>
          </button>
          <button class="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left">
            <p class="font-semibold text-gray-900">🔔 Notifications</p>
            <p class="text-sm text-gray-600 mt-1">Manage your notification preferences</p>
          </button>
          <button class="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left">
            <p class="font-semibold text-gray-900">🌙 Theme</p>
            <p class="text-sm text-gray-600 mt-1">Choose your preferred theme</p>
          </button>
          <button class="p-4 border border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition text-left">
            <p class="font-semibold text-red-600">🚪 Logout</p>
            <p class="text-sm text-gray-600 mt-1">Sign out from your account</p>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class EmployeeProfileComponent {
    private authService = inject(AuthService);
    private dataService = inject(DataService);
    roleService = inject(RoleService);

    currentUser = signal<User | null>(null);
    userLeaves = signal<Leave[]>([]);
    userAttendance = signal<Attendance[]>([]);
    userSalarySlips = signal<SalarySlip[]>([]);
    activeTab = signal('leaves');

    leaveColumns: TableColumn<Leave>[] = [
        { header: 'Type', field: 'type' },
        { header: 'From', field: 'startDate' },
        { header: 'To', field: 'endDate' },
        { header: 'Days', field: 'days' },
        { header: 'Status', field: 'status' },
    ];

    attendanceColumns: TableColumn<Attendance>[] = [
        { header: 'Date', field: 'date' },
        { header: 'Check In', field: 'checkIn' },
        { header: 'Check Out', field: 'checkOut' },
        { header: 'Hours', field: 'workingHours' },
        { header: 'Status', field: 'status' },
    ];

    salaryColumns: TableColumn<SalarySlip>[] = [
        { header: 'Month', field: 'month' },
        { header: 'Year', field: 'year' },
        { header: 'Base', field: 'baseSalary' },
        { header: 'Allowances', field: 'allowances' },
        { header: 'Deductions', field: 'deductions' },
        { header: 'Net', field: 'netSalary' },
    ];

    constructor() {
        this.currentUser.set(this.authService.getCurrentUser());
        if (this.currentUser()) {
            this.loadUserData();
        }
    }

    private loadUserData(): void {
        const userId = this.currentUser()?.id;
        if (!userId) return;

        this.dataService.getLeavesByEmployee(userId).subscribe((leaves) => {
            this.userLeaves.set(leaves);
        });

        this.dataService.getAttendanceByEmployee(userId).subscribe((attendance) => {
            this.userAttendance.set(attendance);
        });

        this.dataService.getSalarySlipsByEmployee(userId).subscribe((slips) => {
            this.userSalarySlips.set(slips);
        });
    }
}

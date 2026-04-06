import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Employee, Leave, Attendance } from '../../core/models/index';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table.component';

// Employees List Component
@Component({
    selector: 'app-employees',
    standalone: true,
    imports: [CommonModule, FormsModule, DataTableComponent],
    template: `
    <div class="p-8 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">👥 Employees</h1>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          (click)="toggleModal()"
        >
          ➕ Add Employee
        </button>
      </div>

      <!-- Add Employee Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Add New Employee</h2>
            <form (ngSubmit)="addEmployee()" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input type="text" [(ngModel)]="newEmployee.name" name="name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" [(ngModel)]="newEmployee.email" name="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                <input type="text" [(ngModel)]="newEmployee.department" name="department" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div class="flex gap-2 pt-4">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
                  Save
                </button>
                <button type="button" (click)="toggleModal()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Employees Table -->
      <app-data-table
        [data]="employees()"
        [columns]="employeeColumns"
        [tableConfig]="{ showSearch: true, showPagination: true }"
        [rowActionsData]="[{label: 'View', type: 'primary'}, {label: 'Edit', type: 'secondary'}, {label: 'Delete', type: 'danger'}]"
        (rowActionClicked)="handleAction($event)"
      />
    </div>
  `,
})
export class EmployeesComponent {
    private dataService = inject(DataService);
    employees = signal<Employee[]>([]);
    showModal = signal(false);
    newEmployee: Partial<Employee> = {};

    employeeColumns: TableColumn<Employee>[] = [
        { header: 'Name', field: 'name' },
        { header: 'Email', field: 'email' },
        { header: 'Department', field: 'department' },
        { header: 'Position', field: 'position' },
        { header: 'Join Date', field: 'joinDate' },
        { header: 'Status', field: 'status' },
    ];

    constructor() {
        this.loadEmployees();
    }

    loadEmployees(): void {
        this.dataService.getEmployees().subscribe((emp) => {
            this.employees.set(emp);
        });
    }

    toggleModal(): void {
        this.showModal.update((v) => !v);
        if (!this.showModal()) {
            this.newEmployee = {};
        }
    }

    addEmployee(): void {
        if (this.newEmployee.name && this.newEmployee.email) {
            const emp: Employee = {
                id: Date.now().toString(),
                name: this.newEmployee.name,
                email: this.newEmployee.email,
                phone: '9876543210',
                department: this.newEmployee.department || 'General',
                position: 'Team Member',
                joinDate: new Date().toISOString().split('T')[0],
                status: 'active',
            };

            this.dataService.addEmployee(emp).subscribe(() => {
                this.loadEmployees();
                this.toggleModal();
            });
        }
    }

    handleAction(event: { action: string; row: Employee }): void {
        if (event.action === 'Delete') {
            alert(`Deleted ${event.row.name}`);
        }
    }
}

// Leaves Component
@Component({
    selector: 'app-leaves',
    standalone: true,
    imports: [CommonModule, FormsModule, DataTableComponent],
    template: `
    <div class="p-8 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">📅 Leave Management</h1>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          (click)="toggleModal()"
        >
          ➕ Apply Leave
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Leaves</h3>
          <p class="text-3xl font-bold text-gray-900">{{ leaves().length }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Approved</h3>
          <p class="text-3xl font-bold text-green-600">{{ approvedCount() }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Pending</h3>
          <p class="text-3xl font-bold text-orange-600">{{ pendingCount() }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Rejected</h3>
          <p class="text-3xl font-bold text-red-600">{{ rejectedCount() }}</p>
        </div>
      </div>

      <!-- Apply Leave Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Apply for Leave</h2>
            <form (ngSubmit)="applyLeave()" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Leave Type</label>
                <select [(ngModel)]="newLeave.type" name="type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>casual</option>
                  <option>sick</option>
                  <option>earned</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                <input type="date" [(ngModel)]="newLeave.startDate" name="startDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                <input type="date" [(ngModel)]="newLeave.endDate" name="endDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Reason</label>
                <textarea [(ngModel)]="newLeave.reason" name="reason" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
              </div>
              <div class="flex gap-2 pt-4">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
                  Submit
                </button>
                <button type="button" (click)="toggleModal()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Leaves Table -->
      <app-data-table
        [data]="leaves()"
        [columns]="leaveColumns"
        [tableConfig]="{ showSearch: true, showPagination: true }"
        [rowActionsData]="[{label: 'Approve', type: 'primary'}, {label: 'Reject', type: 'danger'}]"
        (rowActionClicked)="handleLeaveAction($event)"
      />
    </div>
  `,
})
export class LeavesComponent {
    private dataService = inject(DataService);
    leaves = signal<Leave[]>([]);
    showModal = signal(false);
    newLeave: Partial<Leave> = {
        type: 'casual',
        employeeId: '1',
        employeeName: 'Current User',
        approvalLevel: 1,
    };

    leaveColumns: TableColumn<Leave>[] = [
        { header: 'Employee', field: 'employeeName' },
        { header: 'Type', field: 'type' },
        { header: 'Start Date', field: 'startDate' },
        { header: 'End Date', field: 'endDate' },
        { header: 'Days', field: 'days' },
        { header: 'Status', field: 'status' },
    ];

    constructor() {
        this.loadLeaves();
    }

    loadLeaves(): void {
        this.dataService.getLeaves().subscribe((leaves) => {
            this.leaves.set(leaves);
        });
    }

    get approvedCount(): () => number {
        return () => this.leaves().filter((l) => l.status === 'approved').length;
    }

    get pendingCount(): () => number {
        return () => this.leaves().filter((l) => l.status === 'pending').length;
    }

    get rejectedCount(): () => number {
        return () => this.leaves().filter((l) => l.status === 'rejected').length;
    }

    toggleModal(): void {
        this.showModal.update((v) => !v);
    }

    applyLeave(): void {
        if (this.newLeave.startDate && this.newLeave.endDate) {
            const start = new Date(this.newLeave.startDate as string);
            const end = new Date(this.newLeave.endDate as string);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            const leave: Leave = {
                id: `L${Date.now()}`,
                employeeId: '1',
                employeeName: 'Current User',
                type: (this.newLeave.type as any) || 'casual',
                startDate: this.newLeave.startDate,
                endDate: this.newLeave.endDate,
                days,
                reason: this.newLeave.reason || '',
                status: 'pending',
                approvalLevel: 1,
            };

            this.dataService.addLeave(leave).subscribe(() => {
                this.loadLeaves();
                this.toggleModal();
                this.newLeave = { type: 'casual' };
            });
        }
    }

    handleLeaveAction(event: { action: string; row: Leave }): void {
        if (event.action === 'Approve') {
            this.dataService.approveLeave(event.row.id, 'Manager').subscribe(() => {
                this.loadLeaves();
            });
        } else if (event.action === 'Reject') {
            this.dataService.rejectLeave(event.row.id).subscribe(() => {
                this.loadLeaves();
            });
        }
    }
}

// Attendance Component
@Component({
    selector: 'app-attendance',
    standalone: true,
    imports: [CommonModule, DataTableComponent],
    template: `
    <div class="p-8 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">📋 Attendance</h1>
        <button class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition">
          ✓ Check In
        </button>
      </div>

      <!-- Attendance Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Present</h3>
          <p class="text-3xl font-bold text-green-600">38</p>
          <p class="text-gray-600 text-sm mt-2">This Month</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Late Coming</h3>
          <p class="text-3xl font-bold text-orange-600">3</p>
          <p class="text-gray-600 text-sm mt-2">This Month</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Absent</h3>
          <p class="text-3xl font-bold text-red-600">2</p>
          <p class="text-gray-600 text-sm mt-2">This Month</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Attendance Rate</h3>
          <p class="text-3xl font-bold text-purple-600">96%</p>
          <p class="text-gray-600 text-sm mt-2">Current Month</p>
        </div>
      </div>

      <!-- Attendance Table -->
      <app-data-table
        [data]="attendance()"
        [columns]="attendanceColumns"
        [tableConfig]="{ showSearch: true, showPagination: true }"
      />
    </div>
  `,
})
export class AttendanceComponent {
    private dataService = inject(DataService);
    attendance = signal<Attendance[]>([]);

    attendanceColumns: TableColumn<Attendance>[] = [
        { header: 'Date', field: 'date' },
        { header: 'Check In', field: 'checkIn' },
        { header: 'Check Out', field: 'checkOut' },
        { header: 'Working Hours', field: 'workingHours' },
        { header: 'Status', field: 'status' },
    ];

    constructor() {
        this.loadAttendance();
    }

    loadAttendance(): void {
        this.dataService.getAttendance().subscribe((att) => {
            this.attendance.set(att);
        });
    }
}

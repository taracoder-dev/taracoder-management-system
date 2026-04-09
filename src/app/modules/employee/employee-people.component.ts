import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Employee {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    location: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
    reportingTo: string;
}

@Component({
    selector: 'app-employee-people',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 p-6 md:p-10">

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">People</h1>
        <p class="text-gray-500 mt-1">{{ employees.length }} team members across {{ departments.length }} departments</p>
      </div>

      <!-- Search & Filter Bar -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div class="flex-1 min-w-[200px] relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search by name, role, department..."
            class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <select [(ngModel)]="selectedDept"
          class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Departments</option>
          @for (dept of departments; track dept) {
            <option [value]="dept">{{ dept }}</option>
          }
        </select>
        <div class="flex gap-2">
          <button (click)="viewMode.set('grid')"
            class="px-3 py-2.5 rounded-xl text-sm transition"
            [ngClass]="viewMode() === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'">⊞ Grid</button>
          <button (click)="viewMode.set('list')"
            class="px-3 py-2.5 rounded-xl text-sm transition"
            [ngClass]="viewMode() === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'">☰ List</button>
        </div>
      </div>

      <!-- Grid View -->
      @if (viewMode() === 'grid') {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (emp of filteredEmployees(); track emp.id) {
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all text-center">
              <div class="relative inline-block mb-3">
                <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto"
                  [style.background]="getAvatarColor(emp.name)">
                  {{ emp.avatar }}
                </div>
                <span class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
                  [ngClass]="{
                    'bg-green-400': emp.status === 'online',
                    'bg-gray-400':  emp.status === 'offline',
                    'bg-yellow-400':emp.status === 'away'
                  }"></span>
              </div>
              <h3 class="font-semibold text-gray-800 text-sm">{{ emp.name }}</h3>
              <p class="text-xs text-blue-600 font-medium mt-0.5">{{ emp.role }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ emp.department }}</p>
              <p class="text-xs text-gray-400 mt-0.5">📍 {{ emp.location }}</p>
              <div class="flex gap-2 mt-4 justify-center">
                <a [href]="'mailto:' + emp.email"
                  class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium transition">
                  ✉ Email
                </a>
                <a [href]="'tel:' + emp.phone"
                  class="bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1.5 rounded-lg text-xs font-medium transition">
                  📞 Call
                </a>
              </div>
            </div>
          }
        </div>
      }

      <!-- List View -->
      @if (viewMode() === 'list') {
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Reporting To</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              @for (emp of filteredEmployees(); track emp.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                        [style.background]="getAvatarColor(emp.name)">
                        {{ emp.avatar }}
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-800">{{ emp.name }}</p>
                        <p class="text-xs text-gray-400">{{ emp.role }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ emp.department }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ emp.location }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ emp.reportingTo }}</td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      <a [href]="'mailto:' + emp.email" class="text-blue-500 hover:text-blue-700 text-sm">✉</a>
                      <a [href]="'tel:' + emp.phone" class="text-green-500 hover:text-green-700 text-sm">📞</a>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (filteredEmployees().length === 0) {
            <div class="p-10 text-center text-gray-400 text-sm">No employees found</div>
          }
        </div>
      }
    </div>
  `
})
export class EmployeePeopleComponent {
    searchQuery = '';
    selectedDept = '';
    viewMode = signal<'grid' | 'list'>('grid');

    departments = ['Engineering', 'Design', 'HR', 'Finance', 'Product', 'Marketing'];

    employees: Employee[] = [
        { id: 'E001', name: 'Amit Sharma', role: 'Senior Developer', department: 'Engineering', email: 'amit@company.com', phone: '+91-9876543210', location: 'Bengaluru', avatar: 'AS', status: 'online', reportingTo: 'Vikram Patel' },
        { id: 'E002', name: 'Priya Verma', role: 'UI/UX Designer', department: 'Design', email: 'priya@company.com', phone: '+91-9876543211', location: 'Mumbai', avatar: 'PV', status: 'online', reportingTo: 'Sonia Mehta' },
        { id: 'E003', name: 'Rahul Singh', role: 'Product Manager', department: 'Product', email: 'rahul@company.com', phone: '+91-9876543212', location: 'Delhi', avatar: 'RS', status: 'away', reportingTo: 'Neha Gupta' },
        { id: 'E004', name: 'Neha Gupta', role: 'HR Manager', department: 'HR', email: 'neha@company.com', phone: '+91-9876543213', location: 'Pune', avatar: 'NG', status: 'online', reportingTo: 'CEO' },
        { id: 'E005', name: 'Vikram Patel', role: 'Tech Lead', department: 'Engineering', email: 'vikram@company.com', phone: '+91-9876543214', location: 'Bengaluru', avatar: 'VP', status: 'offline', reportingTo: 'CTO' },
        { id: 'E006', name: 'Sonia Mehta', role: 'Design Lead', department: 'Design', email: 'sonia@company.com', phone: '+91-9876543215', location: 'Mumbai', avatar: 'SM', status: 'online', reportingTo: 'CPO' },
        { id: 'E007', name: 'Arjun Khanna', role: 'Finance Analyst', department: 'Finance', email: 'arjun@company.com', phone: '+91-9876543216', location: 'Delhi', avatar: 'AK', status: 'offline', reportingTo: 'CFO' },
        { id: 'E008', name: 'Kavya Reddy', role: 'Marketing Head', department: 'Marketing', email: 'kavya@company.com', phone: '+91-9876543217', location: 'Hyderabad', avatar: 'KR', status: 'away', reportingTo: 'CMO' },
    ];

    filteredEmployees = computed(() => {
        const q = this.searchQuery.toLowerCase();
        return this.employees.filter(e =>
            (!q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)) &&
            (!this.selectedDept || e.department === this.selectedDept)
        );
    });

    getAvatarColor(name: string): string {
        const colors = ['#4F46E5', '#7C3AED', '#DB2777', '#059669', '#D97706', '#DC2626', '#0891B2', '#65A30D'];
        return colors[name.charCodeAt(0) % colors.length];
    }
}
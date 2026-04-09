import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Ticket {
    id: string;
    subject: string;
    category: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    createdOn: string;
    description: string;
}

@Component({
    selector: 'app-employee-helpdesk',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 p-6 md:p-10">

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Help Desk</h1>
        <p class="text-gray-500 mt-1">Raise a ticket and we'll get back to you</p>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @for (stat of ticketStats(); track stat.label) {
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <p class="text-3xl font-bold" [ngClass]="stat.color">{{ stat.count }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ stat.label }}</p>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Raise Ticket Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5">
              <h2 class="text-xl font-semibold text-white">Raise a New Ticket</h2>
              <p class="text-orange-100 text-sm mt-0.5">Our support team typically responds within 4 hours</p>
            </div>

            @if (isSubmitted()) {
              <div class="m-6 bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-4">
                <div class="bg-green-100 rounded-full p-2 shrink-0">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-green-800">Ticket Raised Successfully!</h3>
                  <p class="text-green-700 text-sm mt-1">
                    Your ticket <strong>#{{ ticketRefId() }}</strong> has been submitted.
                    Expect a response within 4 business hours.
                  </p>
                  <button (click)="resetForm()" class="mt-3 text-xs text-green-700 underline font-medium">
                    Raise Another Ticket
                  </button>
                </div>
              </div>
            }

            @if (!isSubmitted()) {
              <form class="p-6 space-y-5" (ngSubmit)="submitTicket()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Category <span class="text-red-500">*</span></label>
                    <select [(ngModel)]="form.category" name="category"
                      class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                      <option value="" disabled>Select category</option>
                      @for (cat of ticketCategories; track cat) {
                        <option [value]="cat">{{ cat }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Priority <span class="text-red-500">*</span></label>
                    <div class="flex gap-2">
                      @for (p of priorities; track p.value) {
                        <label class="flex-1 cursor-pointer">
                          <input type="radio" [(ngModel)]="form.priority" [value]="p.value" name="priority" class="sr-only">
                          <div class="border-2 rounded-xl py-2 text-center text-xs font-semibold transition-all"
                            [ngClass]="form.priority === p.value ? p.activeClass : 'border-gray-200 text-gray-500'">
                            {{ p.icon }} {{ p.value }}
                          </div>
                        </label>
                      }
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Subject <span class="text-red-500">*</span></label>
                  <input type="text" [(ngModel)]="form.subject" name="subject"
                    placeholder="Brief subject of your issue"
                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Description <span class="text-red-500">*</span></label>
                  <textarea [(ngModel)]="form.description" name="description" rows="4"
                    placeholder="Describe your issue in detail..."
                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none">
                  </textarea>
                </div>
                <button type="submit" [disabled]="isLoading() || !form.category || !form.subject || !form.description"
                  class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold
                    py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50
                    flex items-center justify-center gap-2">
                  @if (isLoading()) {
                    <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Submitting...
                  } @else {
                    🎧 Submit Ticket
                  }
                </button>
              </form>
            }
          </div>
        </div>

        <!-- Ticket History -->
        <div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div class="px-5 py-4 border-b border-gray-100">
              <h3 class="font-semibold text-gray-800">My Tickets</h3>
            </div>
            <div class="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
              @for (ticket of tickets(); track ticket.id) {
                <div class="px-5 py-4">
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-800 truncate">{{ ticket.subject }}</p>
                      <p class="text-xs text-gray-500">{{ ticket.category }}</p>
                      <div class="flex items-center gap-2 mt-1.5">
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                          [ngClass]="{
                            'bg-red-100 text-red-700':    ticket.priority === 'High',
                            'bg-yellow-100 text-yellow-700': ticket.priority === 'Medium',
                            'bg-green-100 text-green-700':ticket.priority === 'Low'
                          }">{{ ticket.priority }}</span>
                        <span class="text-xs text-gray-400">#{{ ticket.id }}</span>
                      </div>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full font-medium shrink-0"
                      [ngClass]="{
                        'bg-blue-100 text-blue-700':    ticket.status === 'Open',
                        'bg-orange-100 text-orange-700':ticket.status === 'In Progress',
                        'bg-green-100 text-green-700':  ticket.status === 'Resolved',
                        'bg-gray-100 text-gray-600':    ticket.status === 'Closed'
                      }">{{ ticket.status }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeHelpdeskComponent {
    isLoading = signal(false);
    isSubmitted = signal(false);
    ticketRefId = signal('');

    form = { category: '', priority: 'Medium', subject: '', description: '' };

    ticketCategories = ['IT Support', 'HR Query', 'Payroll Issue', 'Access Request', 'Asset Request', 'Other'];
    priorities = [
        { value: 'Low', icon: '🟢', activeClass: 'border-green-400 text-green-700 bg-green-50' },
        { value: 'Medium', icon: '🟡', activeClass: 'border-yellow-400 text-yellow-700 bg-yellow-50' },
        { value: 'High', icon: '🔴', activeClass: 'border-red-400 text-red-700 bg-red-50' },
    ];

    tickets = signal<Ticket[]>([
        { id: 'TKT001', subject: 'Laptop keyboard not working', category: 'IT Support', priority: 'High', status: 'Resolved', createdOn: '2024-03-15', description: '' },
        { id: 'TKT002', subject: 'Salary slip not generated', category: 'Payroll Issue', priority: 'Medium', status: 'In Progress', createdOn: '2024-04-01', description: '' },
        { id: 'TKT003', subject: 'VPN access required', category: 'Access Request', priority: 'Low', status: 'Open', createdOn: '2024-04-08', description: '' },
    ]);

    ticketStats = () => [
        { label: 'Total', count: this.tickets().length, color: 'text-gray-800' },
        { label: 'Open', count: this.tickets().filter(t => t.status === 'Open').length, color: 'text-blue-600' },
        { label: 'In Progress', count: this.tickets().filter(t => t.status === 'In Progress').length, color: 'text-orange-500' },
        { label: 'Resolved', count: this.tickets().filter(t => t.status === 'Resolved').length, color: 'text-green-600' },
    ];

    submitTicket() {
        this.isLoading.set(true);
        setTimeout(() => {
            const id = 'TKT' + Date.now().toString().slice(-4);
            this.ticketRefId.set(id);
            this.tickets.update(t => [{
                id, ...this.form, status: 'Open', createdOn: new Date().toISOString()
            } as Ticket, ...t]);
            this.isLoading.set(false);
            this.isSubmitted.set(true);
        }, 1500);
    }

    resetForm() {
        this.form = { category: '', priority: 'Medium', subject: '', description: '' };
        this.isSubmitted.set(false);
    }
}
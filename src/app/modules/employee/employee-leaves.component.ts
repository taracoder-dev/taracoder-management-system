import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LeaveApplication {
    leaveType: string;
    fromDate: string;
    toDate: string;
    reason: string;
    contactNumber: string;
    handoverTo: string;
}

interface AppliedLeave {
    id: string;
    leaveType: string;
    fromDate: string;
    toDate: string;
    days: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    appliedOn: string;
}

@Component({
    selector: 'app-employee-leaves',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 p-6 md:p-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Leave Management</h1>
        <p class="text-gray-500 mt-1">Apply and track your leave requests</p>
      </div>

      <!-- Leave Balance Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @for (balance of leaveBalances; track balance.type) {
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl">{{ balance.icon }}</span>
              <span class="text-xs font-semibold px-2 py-1 rounded-full"
                [ngClass]="balance.badgeClass">
                {{ balance.available }} left
              </span>
            </div>
            <p class="text-2xl font-bold text-gray-800">{{ balance.used }}/{{ balance.total }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ balance.type }}</p>
            <!-- Progress bar -->
            <div class="mt-3 bg-gray-100 rounded-full h-1.5">
              <div class="h-1.5 rounded-full transition-all duration-500"
                [ngClass]="balance.progressClass"
                [style.width.%]="(balance.used / balance.total) * 100">
              </div>
            </div>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Apply Leave Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <!-- Form Header -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
              <h2 class="text-xl font-semibold text-white">Apply for Leave</h2>
              <p class="text-blue-100 text-sm mt-0.5">Fill in the details below to submit your request</p>
            </div>

            <!-- Success Message -->
            @if (isSubmitted()) {
              <div class="m-6 bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-4 animate-fade-in">
                <div class="bg-green-100 rounded-full p-2 mt-0.5 shrink-0">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                      d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-green-800 text-base">Leave Application Submitted!</h3>
                  <p class="text-green-700 text-sm mt-1">
                    Your leave request from <strong>{{ submittedLeave()?.fromDate | date:'mediumDate' }}</strong>
                    to <strong>{{ submittedLeave()?.toDate | date:'mediumDate' }}</strong> has been submitted successfully.
                    Your manager will review it shortly.
                  </p>
                  <div class="flex items-center gap-3 mt-3">
                    <span class="text-xs bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full">
                      Ref #{{ generatedRefId() }}
                    </span>
                    <button (click)="resetForm()"
                      class="text-xs text-green-700 underline underline-offset-2 hover:text-green-900 font-medium">
                      Apply Another Leave
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- Form -->
            @if (!isSubmitted()) {
              <form class="p-6 space-y-5" #leaveForm="ngForm" (ngSubmit)="submitLeave(leaveForm)">

                <!-- Leave Type -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Leave Type <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    @for (type of leaveTypes; track type.value) {
                      <label class="cursor-pointer">
                        <input type="radio" name="leaveType" [value]="type.value"
                          [(ngModel)]="form.leaveType" class="sr-only" required>
                        <div class="border-2 rounded-xl p-3 text-center transition-all duration-200"
                          [ngClass]="form.leaveType === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'">
                          <span class="text-xl block mb-1">{{ type.icon }}</span>
                          <span class="text-xs font-medium">{{ type.label }}</span>
                        </div>
                      </label>
                    }
                  </div>
                  @if (formSubmitAttempted() && !form.leaveType) {
                    <p class="text-red-500 text-xs mt-1">Please select a leave type</p>
                  }
                </div>

                <!-- Date Range -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      From Date <span class="text-red-500">*</span>
                    </label>
                    <input type="date" name="fromDate" [(ngModel)]="form.fromDate"
                      [min]="todayDate" required
                      class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        text-gray-800 transition-all">
                    @if (formSubmitAttempted() && !form.fromDate) {
                      <p class="text-red-500 text-xs mt-1">From date is required</p>
                    }
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      To Date <span class="text-red-500">*</span>
                    </label>
                    <input type="date" name="toDate" [(ngModel)]="form.toDate"
                      [min]="form.fromDate || todayDate" required
                      class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        text-gray-800 transition-all">
                    @if (formSubmitAttempted() && !form.toDate) {
                      <p class="text-red-500 text-xs mt-1">To date is required</p>
                    }
                  </div>
                </div>

                <!-- Days Counter -->
                @if (form.fromDate && form.toDate && calculatedDays() > 0) {
                  <div class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
                    <span class="text-blue-500 text-lg">📅</span>
                    <span class="text-sm text-blue-700">
                      You are applying for
                      <strong>{{ calculatedDays() }} working day{{ calculatedDays() > 1 ? 's' : '' }}</strong>
                    </span>
                  </div>
                }

                <!-- Handover To -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Handover To <span class="text-red-500">*</span>
                  </label>
                  <select name="handoverTo" [(ngModel)]="form.handoverTo" required
                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-gray-800 bg-white transition-all">
                    <option value="" disabled>Select team member</option>
                    @for (member of teamMembers; track member) {
                      <option [value]="member">{{ member }}</option>
                    }
                  </select>
                  @if (formSubmitAttempted() && !form.handoverTo) {
                    <p class="text-red-500 text-xs mt-1">Please select handover person</p>
                  }
                </div>

                <!-- Contact Number -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact Number During Leave
                  </label>
                  <input type="tel" name="contactNumber" [(ngModel)]="form.contactNumber"
                    placeholder="e.g. +91 98765 43210"
                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-gray-800 transition-all">
                </div>

                <!-- Reason -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Reason for Leave <span class="text-red-500">*</span>
                  </label>
                  <textarea name="reason" [(ngModel)]="form.reason" rows="3" required
                    placeholder="Briefly describe the reason for your leave..."
                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-gray-800 resize-none transition-all">
                  </textarea>
                  @if (formSubmitAttempted() && !form.reason) {
                    <p class="text-red-500 text-xs mt-1">Reason is required</p>
                  }
                </div>

                <!-- Submit Button -->
                <div class="flex items-center gap-3 pt-2">
                  <button type="submit" [disabled]="isLoading()"
                    class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                      font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700
                      transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                    @if (isLoading()) {
                      <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span>Submitting...</span>
                    } @else {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                      </svg>
                      <span>Submit Leave Application</span>
                    }
                  </button>
                  <button type="button" (click)="clearForm()"
                    class="px-5 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl
                      hover:bg-gray-50 transition-all duration-200">
                    Clear
                  </button>
                </div>

              </form>
            }
          </div>
        </div>

        <!-- Right Panel: Leave History -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div class="px-5 py-4 border-b border-gray-100">
              <h3 class="font-semibold text-gray-800">Recent Applications</h3>
              <p class="text-xs text-gray-400 mt-0.5">Your leave history</p>
            </div>
            <div class="divide-y divide-gray-50">
              @for (leave of appliedLeaves(); track leave.id) {
                <div class="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-gray-800">{{ leave.leaveType }}</span>
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                          [ngClass]="{
                            'bg-yellow-100 text-yellow-700': leave.status === 'Pending',
                            'bg-green-100 text-green-700':  leave.status === 'Approved',
                            'bg-red-100 text-red-700':      leave.status === 'Rejected'
                          }">
                          {{ leave.status }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ leave.fromDate | date:'MMM d' }} – {{ leave.toDate | date:'MMM d, y' }}
                      </p>
                      <p class="text-xs text-gray-400 mt-0.5">{{ leave.days }} day{{ leave.days > 1 ? 's' : '' }}</p>
                    </div>
                  </div>
                </div>
              }
              @if (appliedLeaves().length === 0) {
                <div class="px-5 py-10 text-center">
                  <span class="text-3xl block mb-2">🗓️</span>
                  <p class="text-sm text-gray-400">No leave applications yet</p>
                </div>
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
    styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
  `]
})
export class EmployeeLeavesComponent {

    // ── State ────────────────────────────────────────────────────
    isLoading = signal(false);
    isSubmitted = signal(false);
    formSubmitAttempted = signal(false);
    submittedLeave = signal<LeaveApplication | null>(null);
    generatedRefId = signal('');
    appliedLeaves = signal<AppliedLeave[]>([
        {
            id: 'LV001', leaveType: 'Casual Leave',
            fromDate: '2024-03-10', toDate: '2024-03-11',
            days: 2, reason: 'Family function',
            status: 'Approved', appliedOn: '2024-03-05'
        },
        {
            id: 'LV002', leaveType: 'Sick Leave',
            fromDate: '2024-02-20', toDate: '2024-02-20',
            days: 1, reason: 'Not feeling well',
            status: 'Approved', appliedOn: '2024-02-20'
        },
        {
            id: 'LV003', leaveType: 'Earned Leave',
            fromDate: '2024-04-15', toDate: '2024-04-19',
            days: 5, reason: 'Vacation',
            status: 'Pending', appliedOn: '2024-04-01'
        }
    ]);

    // ── Form Model ───────────────────────────────────────────────
    form: LeaveApplication = {
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: '',
        contactNumber: '',
        handoverTo: ''
    };

    // ── Static Data ──────────────────────────────────────────────
    todayDate = new Date().toISOString().split('T')[0];

    leaveTypes = [
        { value: 'Casual Leave', label: 'Casual', icon: '🏖️' },
        { value: 'Sick Leave', label: 'Sick', icon: '🤒' },
        { value: 'Earned Leave', label: 'Earned', icon: '⭐' },
        { value: 'Emergency Leave', label: 'Emergency', icon: '🚨' },
    ];

    teamMembers = [
        'Amit Sharma', 'Priya Verma', 'Rahul Singh',
        'Neha Gupta', 'Vikram Patel', 'Sonia Mehta'
    ];

    leaveBalances = [
        {
            type: 'Casual Leave', icon: '🏖️', total: 12, used: 2, available: 10,
            badgeClass: 'bg-blue-100 text-blue-700',
            progressClass: 'bg-blue-400'
        },
        {
            type: 'Sick Leave', icon: '🤒', total: 10, used: 1, available: 9,
            badgeClass: 'bg-green-100 text-green-700',
            progressClass: 'bg-green-400'
        },
        {
            type: 'Earned Leave', icon: '⭐', total: 15, used: 10, available: 5,
            badgeClass: 'bg-yellow-100 text-yellow-700',
            progressClass: 'bg-yellow-400'
        },
        {
            type: 'Emergency', icon: '🚨', total: 5, used: 0, available: 5,
            badgeClass: 'bg-red-100 text-red-700',
            progressClass: 'bg-red-400'
        },
    ];

    // ── Computed: calculate working days ────────────────────────
    calculatedDays = computed(() => {
        if (!this.form.fromDate || !this.form.toDate) return 0;
        const from = new Date(this.form.fromDate);
        const to = new Date(this.form.toDate);
        if (to < from) return 0;
        let days = 0;
        const current = new Date(from);
        while (current <= to) {
            const day = current.getDay();
            if (day !== 0 && day !== 6) days++; // skip weekends
            current.setDate(current.getDate() + 1);
        }
        return days;
    });

    // ── Submit ───────────────────────────────────────────────────
    submitLeave(formRef: any): void {
        this.formSubmitAttempted.set(true);

        if (!this.form.leaveType || !this.form.fromDate ||
            !this.form.toDate || !this.form.reason || !this.form.handoverTo) {
            return;
        }

        this.isLoading.set(true);

        // Simulate API call
        setTimeout(() => {
            const refId = 'LV' + Date.now().toString().slice(-6);
            this.generatedRefId.set(refId);
            this.submittedLeave.set({ ...this.form });

            // Add to leave history
            this.appliedLeaves.update(leaves => [{
                id: refId,
                leaveType: this.form.leaveType,
                fromDate: this.form.fromDate,
                toDate: this.form.toDate,
                days: this.calculatedDays(),
                reason: this.form.reason,
                status: 'Pending',
                appliedOn: this.todayDate
            }, ...leaves]);

            this.isLoading.set(false);
            this.isSubmitted.set(true);
            this.formSubmitAttempted.set(false);
        }, 1500);
    }

    // ── Reset after success ──────────────────────────────────────
    resetForm(): void {
        this.isSubmitted.set(false);
        this.submittedLeave.set(null);
        this.clearForm();
    }

    clearForm(): void {
        this.form = {
            leaveType: '', fromDate: '', toDate: '',
            reason: '', contactNumber: '', handoverTo: ''
        };
        this.formSubmitAttempted.set(false);
    }
}
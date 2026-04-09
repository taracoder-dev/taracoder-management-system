import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Referral {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    status: 'Submitted' | 'In Review' | 'Interviewed' | 'Hired' | 'Rejected';
    submittedOn: string;
    reward: number;
}

@Component({
    selector: 'app-employee-referral',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 p-6 md:p-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Referral Program</h1>
        <p class="text-gray-500 mt-1">Refer talented people and earn rewards</p>
      </div>

      <!-- Reward Banner -->
      <div class="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p class="text-purple-100 text-sm font-medium uppercase tracking-wide">Your Referral Earnings</p>
          <p class="text-4xl font-bold mt-1">₹{{ totalRewards().toLocaleString() }}</p>
          <p class="text-purple-200 text-sm mt-1">From {{ referrals().length }} referrals submitted</p>
        </div>
        <div class="grid grid-cols-3 gap-4 text-center">
          @for (stat of referralStats(); track stat.label) {
            <div class="bg-white/20 rounded-xl px-4 py-3">
              <p class="text-2xl font-bold">{{ stat.count }}</p>
              <p class="text-xs text-purple-100">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Refer Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-5">
              <h2 class="text-xl font-semibold text-white">Submit a Referral</h2>
              <p class="text-purple-100 text-sm mt-0.5">Know someone great? Refer them now</p>
            </div>

            @if (isSubmitted()) {
              <div class="m-6 bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-4">
                <div class="bg-green-100 rounded-full p-2 shrink-0">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-green-800">Referral Submitted Successfully!</h3>
                  <p class="text-green-700 text-sm mt-1">
                    <strong>{{ submittedName() }}</strong> has been referred for <strong>{{ submittedPosition() }}</strong>.
                    Our HR team will reach out to them shortly.
                  </p>
                  <button (click)="resetForm()" class="mt-3 text-xs text-green-700 underline font-medium">
                    Refer Another Candidate
                  </button>
                </div>
              </div>
            }

            @if (!isSubmitted()) {
              <form class="p-6 space-y-5" (ngSubmit)="submitReferral()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span class="text-red-500">*</span></label>
                    <input type="text" [(ngModel)]="form.name" name="name"
                      placeholder="Candidate full name"
                      class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span class="text-red-500">*</span></label>
                    <input type="email" [(ngModel)]="form.email" name="email"
                      placeholder="candidate@email.com"
                      class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input type="tel" [(ngModel)]="form.phone" name="phone"
                      placeholder="+91 98765 43210"
                      class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Position Applied For <span class="text-red-500">*</span></label>
                    <select [(ngModel)]="form.position" name="position"
                      class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                      <option value="" disabled>Select position</option>
                      @for (pos of openPositions; track pos) {
                        <option [value]="pos">{{ pos }}</option>
                      }
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Why are you referring this person?</label>
                  <textarea [(ngModel)]="form.note" name="note" rows="3"
                    placeholder="Share why this person would be a great fit..."
                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none">
                  </textarea>
                </div>
                <div class="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center gap-3">
                  <span class="text-2xl">🎁</span>
                  <div>
                    <p class="text-sm font-semibold text-purple-800">Earn ₹15,000 reward</p>
                    <p class="text-xs text-purple-600">Paid after candidate completes 90 days</p>
                  </div>
                </div>
                <button type="submit" [disabled]="isLoading() || !form.name || !form.email || !form.position"
                  class="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold
                    py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2">
                  @if (isLoading()) {
                    <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Submitting...
                  } @else {
                    🤝 Submit Referral
                  }
                </button>
              </form>
            }
          </div>
        </div>

        <!-- Referral History -->
        <div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div class="px-5 py-4 border-b border-gray-100">
              <h3 class="font-semibold text-gray-800">My Referrals</h3>
            </div>
            <div class="divide-y divide-gray-50">
              @for (ref of referrals(); track ref.id) {
                <div class="px-5 py-4">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-800">{{ ref.name }}</p>
                      <p class="text-xs text-gray-500">{{ ref.position }}</p>
                      <p class="text-xs text-gray-400 mt-0.5">{{ ref.submittedOn | date:'mediumDate' }}</p>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full font-medium"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-700': ref.status === 'Submitted' || ref.status === 'In Review',
                        'bg-blue-100 text-blue-700':    ref.status === 'Interviewed',
                        'bg-green-100 text-green-700':  ref.status === 'Hired',
                        'bg-red-100 text-red-700':      ref.status === 'Rejected'
                      }">{{ ref.status }}</span>
                  </div>
                  @if (ref.status === 'Hired') {
                    <p class="text-xs text-green-600 font-semibold mt-1">🎉 ₹{{ ref.reward.toLocaleString() }} earned</p>
                  }
                </div>
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class EmployeeReferralComponent {
    isLoading = signal(false);
    isSubmitted = signal(false);
    submittedName = signal('');
    submittedPosition = signal('');

    form = { name: '', email: '', phone: '', position: '', note: '' };

    openPositions = [
        'Senior Angular Developer', 'React Developer', 'Java Backend Engineer',
        'DevOps Engineer', 'QA Automation', 'UI/UX Designer', 'Product Manager'
    ];

    referrals = signal<Referral[]>([
        { id: 'R001', name: 'Arjun Mehta', email: 'arjun@mail.com', phone: '', position: 'React Developer', status: 'Hired', submittedOn: '2024-01-15', reward: 15000 },
        { id: 'R002', name: 'Simran Kaur', email: 'sim@mail.com', phone: '', position: 'QA Automation', status: 'Interviewed', submittedOn: '2024-03-10', reward: 0 },
        { id: 'R003', name: 'Rohit Bansal', email: 'rohit@mail.com', phone: '', position: 'DevOps Engineer', status: 'In Review', submittedOn: '2024-04-01', reward: 0 },
    ]);

    totalRewards = () => this.referrals().reduce((sum, r) => sum + r.reward, 0);

    referralStats = () => [
        { label: 'Submitted', count: this.referrals().length },
        { label: 'Hired', count: this.referrals().filter(r => r.status === 'Hired').length },
        { label: 'Pending', count: this.referrals().filter(r => r.status !== 'Hired' && r.status !== 'Rejected').length },
    ];

    submitReferral() {
        this.isLoading.set(true);
        setTimeout(() => {
            this.submittedName.set(this.form.name);
            this.submittedPosition.set(this.form.position);
            this.referrals.update(r => [{
                id: 'R' + Date.now(), ...this.form,
                status: 'Submitted', submittedOn: new Date().toISOString(), reward: 0
            } as Referral, ...r]);
            this.isLoading.set(false);
            this.isSubmitted.set(true);
        }, 1500);
    }

    resetForm() {
        this.form = { name: '', email: '', phone: '', position: '', note: '' };
        this.isSubmitted.set(false);
    }
}
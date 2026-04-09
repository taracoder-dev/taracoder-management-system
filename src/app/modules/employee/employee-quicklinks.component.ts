import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface QuickLink {
    id: string;
    title: string;
    url: string;
    category: string;
    icon: string;
    isPinned: boolean;
}

@Component({
    selector: 'app-employee-quicklinks',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 p-6 md:p-10">

      <div class="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Quick Links</h1>
          <p class="text-gray-500 mt-1">Access your most-used tools and resources</p>
        </div>
        <button (click)="showAddModal.set(true)"
          class="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2 text-sm">
          ＋ Add Link
        </button>
      </div>

      <!-- Add Link Modal -->
      @if (showAddModal()) {
        <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-5">Add Quick Link</h3>
            <div class="space-y-4">
              <input type="text" [(ngModel)]="newLink.title" placeholder="Link title"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <input type="url" [(ngModel)]="newLink.url" placeholder="https://..."
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <select [(ngModel)]="newLink.category"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                @for (cat of linkCategories; track cat) {
                  <option [value]="cat">{{ cat }}</option>
                }
              </select>
            </div>
            <div class="flex gap-3 mt-6">
              <button (click)="addLink()"
                class="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition">
                Add Link
              </button>
              <button (click)="showAddModal.set(false)"
                class="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Pinned Links -->
      @if (pinnedLinks().length > 0) {
        <div class="mb-8">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">📌 Pinned</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @for (link of pinnedLinks(); track link.id) {
              <a [href]="link.url" target="_blank"
                class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all group text-center">
                <div class="text-3xl mb-3">{{ link.icon }}</div>
                <p class="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition">{{ link.title }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ link.category }}</p>
              </a>
            }
          </div>
        </div>
      }

      <!-- All Links by Category -->
      @for (cat of linkCategories; track cat) {
        @if (linksByCategory(cat).length > 0) {
          <div class="mb-6">
            <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{{ cat }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              @for (link of linksByCategory(cat); track link.id) {
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-all group">
                  <div class="text-2xl bg-gray-50 rounded-xl p-2.5 shrink-0">{{ link.icon }}</div>
                  <div class="flex-1 min-w-0">
                    <a [href]="link.url" target="_blank"
                      class="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition truncate block">
                      {{ link.title }}
                    </a>
                    <p class="text-xs text-gray-400 truncate">{{ link.url }}</p>
                  </div>
                  <button (click)="togglePin(link.id)" [title]="link.isPinned ? 'Unpin' : 'Pin'"
                    class="text-gray-300 hover:text-yellow-400 transition text-lg shrink-0">
                    {{ link.isPinned ? '📌' : '📍' }}
                  </button>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `
})
export class EmployeeQuicklinksComponent {
    showAddModal = signal(false);
    newLink = { title: '', url: '', category: 'Tools', icon: '🔗' };

    linkCategories = ['Tools', 'HR & Payroll', 'Communication', 'Learning', 'Other'];

    links = signal<QuickLink[]>([
        { id: 'L001', title: 'Jira Board', url: 'https://jira.company.com', category: 'Tools', icon: '🎯', isPinned: true },
        { id: 'L002', title: 'Confluence', url: 'https://confluence.company.com', category: 'Tools', icon: '📚', isPinned: true },
        { id: 'L003', title: 'GitHub', url: 'https://github.com', category: 'Tools', icon: '🐙', isPinned: false },
        { id: 'L004', title: 'Payslip Portal', url: 'https://payroll.company.com', category: 'HR & Payroll', icon: '💰', isPinned: true },
        { id: 'L005', title: 'Leave Portal', url: 'https://leave.company.com', category: 'HR & Payroll', icon: '🏖️', isPinned: false },
        { id: 'L006', title: 'Slack', url: 'https://slack.com', category: 'Communication', icon: '💬', isPinned: false },
        { id: 'L007', title: 'Google Meet', url: 'https://meet.google.com', category: 'Communication', icon: '📹', isPinned: false },
        { id: 'L008', title: 'Udemy for Business', url: 'https://udemy.com/business', category: 'Learning', icon: '🎓', isPinned: false },
        { id: 'L009', title: 'LinkedIn Learning', url: 'https://linkedin.com/learning', category: 'Learning', icon: '📖', isPinned: false },
    ]);

    pinnedLinks = () => this.links().filter(l => l.isPinned);
    linksByCategory = (cat: string) => this.links().filter(l => l.category === cat);

    togglePin(id: string) {
        this.links.update(links => links.map(l => l.id === id ? { ...l, isPinned: !l.isPinned } : l));
    }

    addLink() {
        if (!this.newLink.title || !this.newLink.url) return;
        this.links.update(l => [...l, {
            id: 'L' + Date.now(),
            ...this.newLink,
            isPinned: false
        }]);
        this.newLink = { title: '', url: '', category: 'Tools', icon: '🔗' };
        this.showAddModal.set(false);
    }
}
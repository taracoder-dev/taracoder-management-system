import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Lead } from '../../core/models/index';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table.component';

@Component({
    selector: 'app-leads',
    standalone: true,
    imports: [CommonModule, FormsModule, DataTableComponent],
    template: `
    <div class="p-8 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">💼 Lead Management</h1>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          (click)="toggleModal()"
        >
          ➕ Add Lead
        </button>
      </div>

      <!-- Sales Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Leads</h3>
          <p class="text-3xl font-bold text-gray-900">{{ leads().length }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Converted</h3>
          <p class="text-3xl font-bold text-green-600">{{ convertedCount() }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Qualified</h3>
          <p class="text-3xl font-bold text-purple-600">{{ qualifiedCount() }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Pipeline Value</h3>
          <p class="text-3xl font-bold text-orange-600">$ {{ (getPipelineValue() / 1000).toFixed(0) }}K</p>
        </div>
      </div>

      <!-- Add Lead Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Add New Lead</h2>
            <form (ngSubmit)="addLead()" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                <input type="text" [(ngModel)]="newLead.companyName" name="companyName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Contact Person</label>
                <input type="text" [(ngModel)]="newLead.contactPerson" name="contactPerson" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" [(ngModel)]="newLead.email" name="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <input type="tel" [(ngModel)]="newLead.phone" name="phone" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Estimated Value ($)</label>
                <input type="number" [(ngModel)]="newLead.value" name="value" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Source</label>
                <select [(ngModel)]="newLead.source" name="source" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>LinkedIn</option>
                  <option>Email Campaign</option>
                  <option>Referral</option>
                  <option>Website</option>
                  <option>Event</option>
                </select>
              </div>
              <div class="flex gap-2 pt-4">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
                  Add Lead
                </button>
                <button type="button" (click)="toggleModal()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Filter & Summary Section -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        @for (status of statuses; track status) {
          <button
            (click)="filterByStatus(status)"
            class="p-4 bg-white rounded-lg shadow-md border-l-4 transition hover:shadow-lg"
            [class.border-blue-500]="selectedStatus() === status"
            [class.border-gray-300]="selectedStatus() !== status"
          >
            <div class="font-semibold text-gray-900 capitalize">{{ status }}: {{ getStatusCount(status) }}</div>
          </button>
        }
      </div>

      <!-- Leads Table -->
      <app-data-table
        [data]="getFilteredLeads()"
        [columns]="leadColumns"
        [tableConfig]="{ showSearch: true, showPagination: true }"
        [rowActionsData]="[{label: 'Update', type: 'primary'}, {label: 'Convert', type: 'primary'}, {label: 'Delete', type: 'danger'}]"
        (rowActionClicked)="handleAction($event)"
      />
    </div>
  `,
})
export class LeadsComponent {
    private dataService = inject(DataService);
    leads = signal<Lead[]>([]);
    showModal = signal(false);
    selectedStatus = signal<string | null>(null);
    statuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];

    newLead: Partial<Lead> = {
        status: 'new',
        source: 'LinkedIn',
    };

    leadColumns: TableColumn<Lead>[] = [
        { header: 'Company', field: 'companyName' },
        { header: 'Contact', field: 'contactPerson' },
        { header: 'Email', field: 'email' },
        { header: 'Phone', field: 'phone' },
        { header: 'Status', field: 'status' },
        { header: 'Value', field: 'value' },
        { header: 'Source', field: 'source' },
    ];

    constructor() {
        this.loadLeads();
    }

    loadLeads(): void {
        this.dataService.getLeads().subscribe((leads) => {
            this.leads.set(leads);
        });
    }

    get convertedCount(): () => number {
        return () => this.leads().filter((l) => l.status === 'converted').length;
    }

    get qualifiedCount(): () => number {
        return () => this.leads().filter((l) => l.status === 'qualified').length;
    }

    getPipelineValue(): number {
        return this.leads()
            .filter((l) => l.status !== 'lost')
            .reduce((sum, l) => sum + (l.value || 0), 0);
    }

    toggleModal(): void {
        this.showModal.update((v) => !v);
        if (!this.showModal()) {
            this.newLead = { status: 'new', source: 'LinkedIn' };
        }
    }

    getStatusCount(status: string): number {
        return this.leads().filter((l) => l.status === status).length;
    }

    filterByStatus(status: string): void {
        this.selectedStatus.set(this.selectedStatus() === status ? null : status);
    }

    getFilteredLeads(): Lead[] {
        if (!this.selectedStatus()) return this.leads();
        return this.leads().filter((l) => l.status === this.selectedStatus());
    }

    addLead(): void {
        if (this.newLead.companyName && this.newLead.contactPerson) {
            const lead: Lead = {
                id: `LD${Date.now()}`,
                companyName: this.newLead.companyName,
                contactPerson: this.newLead.contactPerson,
                email: this.newLead.email || '',
                phone: this.newLead.phone || '',
                status: 'new',
                value: this.newLead.value || 0,
                assignedTo: 'Current User',
                source: this.newLead.source || 'Manual',
                createdAt: new Date().toISOString().split('T')[0],
            };

            this.dataService.addLead(lead).subscribe(() => {
                this.loadLeads();
                this.toggleModal();
            });
        }
    }

    handleAction(event: { action: string; row: Lead }): void {
        if (event.action === 'Convert') {
            this.dataService.updateLead(event.row.id, { status: 'converted' }).subscribe(() => {
                this.loadLeads();
            });
        } else if (event.action === 'Update') {
            alert(`Editing lead: ${event.row.companyName}`);
        } else if (event.action === 'Delete') {
            alert(`Deleted lead: ${event.row.companyName}`);
        }
    }
}

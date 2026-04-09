import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Document {
    id: string;
    name: string;
    category: string;
    size: string;
    uploadedOn: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    icon: string;
}

@Component({
    selector: 'app-employee-documents',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 p-6 md:p-10">

      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">My Documents</h1>
          <p class="text-gray-500 mt-1">Manage and view your official documents</p>
        </div>
        <label class="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer
          hover:bg-blue-700 transition flex items-center gap-2 text-sm">
          <span>📤</span> Upload Document
          <input type="file" class="hidden" (change)="handleUpload($event)">
        </label>
      </div>

      <!-- Upload Success -->
      @if (uploadSuccess()) {
        <div class="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <div class="bg-green-100 rounded-full p-1.5">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <p class="text-green-800 text-sm font-medium">Document uploaded successfully! It will be verified within 24 hours.</p>
          <button (click)="uploadSuccess.set(false)" class="ml-auto text-green-600 hover:text-green-800">✕</button>
        </div>
      }

      <!-- Category Filter -->
      <div class="flex gap-2 mb-6 flex-wrap">
        @for (cat of categories; track cat) {
          <button (click)="activeCategory.set(cat)"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all"
            [ngClass]="activeCategory() === cat
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'">
            {{ cat }}
          </button>
        }
      </div>

      <!-- Documents Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (doc of filteredDocs(); track doc.id) {
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <div class="bg-blue-50 rounded-xl p-3 text-2xl">{{ doc.icon }}</div>
              <span class="text-xs px-2.5 py-1 rounded-full font-medium"
                [ngClass]="{
                  'bg-green-100 text-green-700':  doc.status === 'Verified',
                  'bg-yellow-100 text-yellow-700':doc.status === 'Pending',
                  'bg-red-100 text-red-700':      doc.status === 'Rejected'
                }">
                {{ doc.status === 'Verified' ? '✓ ' : doc.status === 'Pending' ? '⏳ ' : '✕ ' }}{{ doc.status }}
              </span>
            </div>
            <h3 class="font-semibold text-gray-800 text-sm">{{ doc.name }}</h3>
            <p class="text-xs text-gray-400 mt-1">{{ doc.category }}</p>
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <div>
                <p class="text-xs text-gray-500">{{ doc.size }}</p>
                <p class="text-xs text-gray-400">{{ doc.uploadedOn | date:'mediumDate' }}</p>
              </div>
              <div class="flex gap-2">
                <button class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition">
                  👁 View
                </button>
                <button class="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg transition">
                  ⬇ Download
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      @if (filteredDocs().length === 0) {
        <div class="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p class="text-5xl mb-3">📂</p>
          <p class="text-gray-500 font-medium">No documents in this category</p>
          <p class="text-gray-400 text-sm mt-1">Upload your documents to get started</p>
        </div>
      }
    </div>
  `
})
export class EmployeeDocumentsComponent {
    activeCategory = signal('All');
    uploadSuccess = signal(false);

    categories = ['All', 'Identity', 'Employment', 'Education', 'Financial'];

    documents = signal<Document[]>([
        { id: 'D001', name: 'Aadhaar Card', category: 'Identity', size: '1.2 MB', uploadedOn: '2023-06-01', status: 'Verified', icon: '🪪' },
        { id: 'D002', name: 'PAN Card', category: 'Identity', size: '0.8 MB', uploadedOn: '2023-06-01', status: 'Verified', icon: '💳' },
        { id: 'D003', name: 'Offer Letter', category: 'Employment', size: '0.5 MB', uploadedOn: '2023-06-15', status: 'Verified', icon: '📄' },
        { id: 'D004', name: 'Experience Letter', category: 'Employment', size: '0.3 MB', uploadedOn: '2023-07-01', status: 'Verified', icon: '📜' },
        { id: 'D005', name: 'B.Tech Certificate', category: 'Education', size: '2.1 MB', uploadedOn: '2023-06-10', status: 'Pending', icon: '🎓' },
        { id: 'D006', name: 'Marksheet 10th', category: 'Education', size: '1.5 MB', uploadedOn: '2023-06-10', status: 'Verified', icon: '📋' },
        { id: 'D007', name: 'Bank Passbook', category: 'Financial', size: '1.8 MB', uploadedOn: '2023-06-05', status: 'Verified', icon: '🏦' },
        { id: 'D008', name: 'Form 16 FY2023-24', category: 'Financial', size: '0.9 MB', uploadedOn: '2024-04-01', status: 'Pending', icon: '📊' },
    ]);

    filteredDocs = () =>
        this.activeCategory() === 'All'
            ? this.documents()
            : this.documents().filter(d => d.category === this.activeCategory());

    handleUpload(event: any) {
        const file = event.target.files?.[0];
        if (!file) return;
        this.documents.update(docs => [{
            id: 'D' + Date.now(),
            name: file.name,
            category: 'Identity',
            size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
            uploadedOn: new Date().toISOString(),
            status: 'Pending',
            icon: '📎'
        } as Document, ...docs]);
        this.uploadSuccess.set(true);
        setTimeout(() => this.uploadSuccess.set(false), 5000);
    }
}
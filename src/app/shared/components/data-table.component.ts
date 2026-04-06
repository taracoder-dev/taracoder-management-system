import { Component, Input, Output, EventEmitter, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn<T = any> {
    header: string;
    field: keyof T;
    sortable?: boolean;
    width?: string;
    template?: (item: T) => string;
    class?: string;
}

export interface TableConfig {
    pageSize?: number;
    pageSizeOptions?: number[];
    showSearch?: boolean;
    showPagination?: boolean;
    responsive?: boolean;
}

@Component({
    selector: 'app-data-table',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Header with Search -->
      @if (tableConfig().showSearch) {
        <div class="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              placeholder="🔍 Search..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              (input)="onSearch()"
            />
          </div>
          @if (selectedRows().length > 0) {
            <div class="text-sm text-gray-600">{{ selectedRows().length }} selected</div>
          }
        </div>
      }

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-100 border-b border-gray-200">
            <tr>
              @if (showCheckbox) {
                <th class="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    [(ngModel)]="selectAll"
                    (change)="toggleAllRows()"
                    class="w-4 h-4 cursor-pointer"
                  />
                </th>
              }
              @for (col of columns(); track col.field) {
                <th
                  class="px-6 py-3 text-left font-semibold text-gray-700 text-sm"
                  [style.width]="col.width"
                  [ngClass]="col.class"
                >
                  <div class="flex items-center justify-between">
                    {{ col.header }}
                    @if (col.sortable !== false) {
                      <button
                        (click)="sort(col.field)"
                        class="ml-2 text-gray-400 hover:text-gray-600"
                        title="Sort by {{ col.header }}"
                      >
                        @if (sortColumn === col.field) {
                          <span>{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                        } @else {
                          <span class="opacity-30">⇅</span>
                        }
                      </button>
                    }
                  </div>
                </th>
              }
              @if (rowActionsData() && rowActionsData()!.length > 0) {
                <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">Actions</th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            @if (paginatedData().length === 0) {
              <tr>
                <td [attr.colspan]="columns().length + (showCheckbox ? 1 : 0) + ((rowActionsData()?.length ?? 0) > 0 ? 1 : 0)" class="px-6 py-8 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            } @else {
              @for (row of paginatedData(); track 'row-' + $index; let idx = $index) {
                <tr
                  class="hover:bg-gray-50 transition"
                  [class.bg-blue-50]="selectedRows().includes(row)"
                >
                  @if (showCheckbox) {
                    <td class="px-6 py-3">
                      <input
                        type="checkbox"
                        [checked]="selectedRows().includes(row)"
                        (change)="toggleRowSelection(row)"
                        class="w-4 h-4 cursor-pointer"
                      />
                    </td>
                  }
                  @for (col of columns(); track col.field) {
                    <td class="px-6 py-3 text-sm text-gray-700" [ngClass]="col.class">
                      @if (col.template) {
                        {{col.template(row)}}
                      } @else {
                        {{row[col.field]}}
                      }
                    </td>
                  }
                  @if (rowActionsData() && rowActionsData()!.length > 0) {
                    <td class="px-6 py-3 text-sm">
                      <div class="flex gap-2">
                        @for (action of rowActionsData()!; track action.label) {
                          <button
                            (click)="rowActionClick(action, row)"
                            class="px-3 py-1 text-sm rounded-md transition"
                            [ngClass]="{
                              'bg-blue-100 text-blue-700 hover:bg-blue-200': action.type === 'primary',
                              'bg-red-100 text-red-700 hover:bg-red-200': action.type === 'danger',
                              'bg-gray-100 text-gray-700 hover:bg-gray-200': action.type === 'secondary'
                            }"
                          >
                            {{ action.label }}
                          </button>
                        }
                      </div>
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Footer with Pagination -->
      @if (tableConfig().showPagination && totalPages > 1) {
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div class="text-sm text-gray-600">
            Showing {{ (currentPage() - 1) * (tableConfig().pageSize ?? 10) + 1 }} to {{ Math.min(currentPage() * (tableConfig().pageSize ?? 10), filteredData().length) }} of {{ filteredData().length }}
          </div>
          <div class="flex items-center gap-2">
            <button
              (click)="previousPage()"
              [disabled]="currentPage() === 1"
              class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <div class="flex gap-1">
              @for (page of pages(); track page) {
                <button
                  (click)="goToPage(page)"
                  [class.bg-blue-600]="currentPage() === page"
                  [class.text-white]="currentPage() === page"
                  [class.text-gray-700]="currentPage() !== page"
                  [class.bg-gray-100]="currentPage() !== page"
                  class="px-3 py-1 rounded-md transition"
                >
                  {{ page }}
                </button>
              }
            </div>
            <button
              (click)="nextPage()"
              [disabled]="currentPage() === totalPages"
              class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      }
    </div>
  `,
    styles: [
        `
      :host {
        display: block;
      }
    `,
    ],
})
export class DataTableComponent<T extends Record<string, any> = any> {
    columns = input<TableColumn<T>[]>([]);
    data = input<T[]>([]);
    tableConfig = input<TableConfig>({
        pageSize: 10,
        pageSizeOptions: [5, 10, 25, 50],
        showSearch: true,
        showPagination: true,
        responsive: true,
    });
    rowActionsData = input<Array<{ label: string; type: 'primary' | 'danger' | 'secondary' }> | null>(null);
    showCheckbox = false;

    // Outputs
    rowActionClicked = output<{ action: string; row: T }>();
    onDataChange = output<T[]>();

    // Signals
    searchTerm = '';
    sortColumn: keyof T | null = null;
    sortDirection: 'asc' | 'desc' = 'asc';
    currentPage = signal(1);
    pageSize = signal(10);
    selectAll = false;
    selectedRows = signal<T[]>([]);

    get Math() {
        return Math;
    }

    get filteredData(): () => T[] {
        return () => {
            let data = this.data();
            if (this.searchTerm) {
                data = data.filter((item: any) =>
                    JSON.stringify(item).toLowerCase().includes(this.searchTerm.toLowerCase())
                );
            }
            return data;
        };
    }

    get paginatedData(): () => T[] {
        return () => {
            const filtered = this.filteredData();
            const start = (this.currentPage() - 1) * (this.tableConfig().pageSize ?? 10);
            return filtered.slice(start, start + (this.tableConfig().pageSize ?? 10));
        };
    }

    get totalPages(): number {
        return Math.ceil(this.filteredData().length / (this.tableConfig().pageSize ?? 10));
    }

    get pages(): () => number[] {
        return () => {
            const pages: number[] = [];
            for (let i = 1; i <= Math.min(5, this.totalPages); i++) {
                pages.push(i);
            }
            return pages;
        };
    }

    sort(field: keyof T): void {
        if (this.sortColumn === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = field;
            this.sortDirection = 'asc';
        }
        this.currentPage.set(1);
    }

    onSearch(): void {
        this.currentPage.set(1);
    }

    toggleAllRows(): void {
        if (this.selectAll) {
            this.selectedRows.set([...this.paginatedData()]);
        } else {
            this.selectedRows.set([]);
        }
    }

    toggleRowSelection(row: T): void {
        this.selectedRows.update((rows: T[]) => {
            const index = rows.findIndex((r) => r === row);
            if (index > -1) {
                return rows.filter((_, i) => i !== index);
            }
            return [...rows, row];
        });
        this.selectAll = this.selectedRows().length === this.paginatedData().length;
    }

    nextPage(): void {
        if (this.currentPage() < this.totalPages) {
            this.currentPage.update((p) => p + 1);
        }
    }

    previousPage(): void {
        if (this.currentPage() > 1) {
            this.currentPage.update((p) => p - 1);
        }
    }

    goToPage(page: number): void {
        this.currentPage.set(page);
    }

    rowActionClick(action: { label: string; type: string }, row: T): void {
        this.rowActionClicked.emit({ action: action.label, row });
    }
}

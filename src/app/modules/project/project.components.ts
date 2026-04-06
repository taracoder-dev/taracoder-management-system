import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Project, Task } from '../../core/models/index';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table.component';

// Projects Component
@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [CommonModule, FormsModule, DataTableComponent],
    template: `
    <div class="p-8 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">📋 Projects</h1>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          (click)="toggleModal()"
        >
          ➕ New Project
        </button>
      </div>

      <!-- Project Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Projects</h3>
          <p class="text-3xl font-bold text-gray-900">{{ projects().length }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Active</h3>
          <p class="text-3xl font-bold text-green-600">{{ activeCount() }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Completed</h3>
          <p class="text-3xl font-bold text-purple-600">{{ completedCount() }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Pending</h3>
          <p class="text-3xl font-bold text-orange-600">{{ pendingCount() }}</p>
        </div>
      </div>

      <!-- New Project Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Create New Project</h2>
            <form (ngSubmit)="createProject()" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Project Name</label>
                <input type="text" [(ngModel)]="newProject.name" name="name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea [(ngModel)]="newProject.description" name="description" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                <input type="date" [(ngModel)]="newProject.startDate" name="startDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Budget ($)</label>
                <input type="number" [(ngModel)]="newProject.budget" name="budget" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div class="flex gap-2 pt-4">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
                  Create
                </button>
                <button type="button" (click)="toggleModal()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Projects Table -->
      <app-data-table
        [data]="projects()"
        [columns]="projectColumns"
        [tableConfig]="{ showSearch: true, showPagination: true }"
        [rowActionsData]="[{label: 'View', type: 'primary'}, {label: 'Edit', type: 'secondary'}, {label: 'Archive', type: 'danger'}]"
        (rowActionClicked)="handleAction($event)"
      />
    </div>
  `,
})
export class ProjectsComponent {
    private dataService = inject(DataService);
    projects = signal<Project[]>([]);
    showModal = signal(false);
    newProject: Partial<Project> = {
        status: 'pending',
        team: [],
        progress: 0,
    };

    projectColumns: TableColumn<Project>[] = [
        { header: 'Name', field: 'name' },
        { header: 'Status', field: 'status' },
        { header: 'Start Date', field: 'startDate' },
        { header: 'Manager', field: 'manager' },
        { header: 'Progress', field: 'progress' },
        { header: 'Budget', field: 'budget' },
    ];

    constructor() {
        this.loadProjects();
    }

    loadProjects(): void {
        this.dataService.getProjects().subscribe((projects) => {
            this.projects.set(projects);
        });
    }

    get activeCount(): () => number {
        return () => this.projects().filter((p) => p.status === 'active').length;
    }

    get completedCount(): () => number {
        return () => this.projects().filter((p) => p.status === 'completed').length;
    }

    get pendingCount(): () => number {
        return () => this.projects().filter((p) => p.status === 'pending').length;
    }

    toggleModal(): void {
        this.showModal.update((v) => !v);
        if (!this.showModal()) {
            this.newProject = { status: 'pending', team: [], progress: 0 };
        }
    }

    createProject(): void {
        if (this.newProject.name && this.newProject.startDate) {
            const project: Project = {
                id: `P${Date.now()}`,
                name: this.newProject.name,
                description: this.newProject.description || '',
                startDate: this.newProject.startDate,
                status: 'pending',
                manager: 'Current Manager',
                team: [],
                progress: 0,
                budget: this.newProject.budget || 0,
                spent: 0,
            };

            this.dataService.addProject(project).subscribe(() => {
                this.loadProjects();
                this.toggleModal();
            });
        }
    }

    handleAction(event: { action: string; row: Project }): void {
        if (event.action === 'Archive') {
            alert(`Archived ${event.row.name}`);
        }
    }
}

// Tasks Component
@Component({
    selector: 'app-tasks',
    standalone: true,
    imports: [CommonModule, FormsModule, DataTableComponent],
    template: `
    <div class="p-8 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">✅ Tasks</h1>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          (click)="toggleModal()"
        >
          ➕ New Task
        </button>
      </div>

      <!-- Task Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Tasks</h3>
          <p class="text-3xl font-bold text-gray-900">{{ tasks().length }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">In Progress</h3>
          <p class="text-3xl font-bold text-blue-600">{{ inProgressCount() }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">Completed</h3>
          <p class="text-3xl font-bold text-green-600">{{ completedCount() }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 class="text-gray-500 text-sm font-semibold mb-2">High Priority</h3>
          <p class="text-3xl font-bold text-red-600">{{ highPriorityCount() }}</p>
        </div>
      </div>

      <!-- New Task Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Create New Task</h2>
            <form (ngSubmit)="createTask()" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Task Title</label>
                <input type="text" [(ngModel)]="newTask.title" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea [(ngModel)]="newTask.description" name="description" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                <select [(ngModel)]="newTask.priority" name="priority" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                <input type="date" [(ngModel)]="newTask.dueDate" name="dueDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div class="flex gap-2 pt-4">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
                  Create
                </button>
                <button type="button" (click)="toggleModal()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Tasks Table -->
      <app-data-table
        [data]="tasks()"
        [columns]="taskColumns"
        [tableConfig]="{ showSearch: true, showPagination: true }"
        [rowActionsData]="[{label: 'Update', type: 'primary'}, {label: 'Complete', type: 'primary'}, {label: 'Delete', type: 'danger'}]"
        (rowActionClicked)="handleAction($event)"
      />
    </div>
  `,
})
export class TasksComponent {
    private dataService = inject(DataService);
    tasks = signal<Task[]>([]);
    showModal = signal(false);
    newTask: Partial<Task> = {
        priority: 'medium',
        status: 'pending',
    };

    taskColumns: TableColumn<Task>[] = [
        { header: 'Title', field: 'title' },
        { header: 'Status', field: 'status' },
        { header: 'Priority', field: 'priority' },
        { header: 'Assigned To', field: 'assignedTo' },
        { header: 'Due Date', field: 'dueDate' },
        { header: 'Progress', field: 'actualHours' },
    ];

    constructor() {
        this.loadTasks();
    }

    loadTasks(): void {
        this.dataService.getTasks().subscribe((tasks) => {
            this.tasks.set(tasks);
        });
    }

    get inProgressCount(): () => number {
        return () => this.tasks().filter((t) => t.status === 'in-progress').length;
    }

    get completedCount(): () => number {
        return () => this.tasks().filter((t) => t.status === 'completed').length;
    }

    get highPriorityCount(): () => number {
        return () => this.tasks().filter((t) => t.priority === 'high' || t.priority === 'critical').length;
    }

    toggleModal(): void {
        this.showModal.update((v) => !v);
        if (!this.showModal()) {
            this.newTask = { priority: 'medium', status: 'pending' };
        }
    }

    createTask(): void {
        if (this.newTask.title && this.newTask.dueDate) {
            const task: Task = {
                id: `T${Date.now()}`,
                projectId: 'P1',
                title: this.newTask.title,
                description: this.newTask.description || '',
                assignedTo: 'Current User',
                status: 'pending',
                priority: (this.newTask.priority as any) || 'medium',
                dueDate: this.newTask.dueDate,
                createdBy: 'Current User',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            this.dataService.addTask(task).subscribe(() => {
                this.loadTasks();
                this.toggleModal();
            });
        }
    }

    handleAction(event: { action: string; row: Task }): void {
        if (event.action === 'Complete') {
            this.dataService.updateTask(event.row.id, { status: 'completed' }).subscribe(() => {
                this.loadTasks();
            });
        } else if (event.action === 'Delete') {
            alert(`Deleted task: ${event.row.title}`);
        }
    }
}

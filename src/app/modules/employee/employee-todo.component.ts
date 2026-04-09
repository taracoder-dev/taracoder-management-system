import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Todo {
    id: string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    dueDate: string;
    tag: string;
    completed: boolean;
    createdAt: string;
}

@Component({
    selector: 'app-employee-todo',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 p-6 md:p-10">

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">To-Do</h1>
        <p class="text-gray-500 mt-1">{{ pendingCount() }} tasks pending · {{ completedCount() }} completed</p>
      </div>

      <!-- Progress Bar -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-medium text-gray-700">Overall Progress</p>
          <p class="text-sm font-bold text-blue-600">{{ progressPercent() }}%</p>
        </div>
        <div class="bg-gray-100 rounded-full h-3">
          <div class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
            [style.width.%]="progressPercent()"></div>
        </div>
        <div class="flex gap-4 mt-3">
          @for (stat of todoStats(); track stat.label) {
            <div class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full" [ngClass]="stat.dot"></div>
              <span class="text-xs text-gray-500">{{ stat.count }} {{ stat.label }}</span>
            </div>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Add Task -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-4">
              <h2 class="text-base font-semibold text-white">Add New Task</h2>
            </div>
            <div class="p-5 space-y-4">
              <input type="text" [(ngModel)]="newTodo.title" placeholder="Task title *"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <textarea [(ngModel)]="newTodo.description" rows="2" placeholder="Description (optional)"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none">
              </textarea>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                  <select [(ngModel)]="newTodo.priority"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Tag</label>
                  <select [(ngModel)]="newTodo.tag"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    @for (tag of tags; track tag) {
                      <option [value]="tag">{{ tag }}</option>
                    }
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
                <input type="date" [(ngModel)]="newTodo.dueDate" [min]="todayDate"
                  class="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <button (click)="addTodo()" [disabled]="!newTodo.title.trim()"
                class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold
                  py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                ＋ Add Task
              </button>
            </div>
          </div>
        </div>

        <!-- Task List -->
        <div class="lg:col-span-2">

          <!-- Filter Tabs -->
          <div class="flex gap-2 mb-4">
            @for (filter of ['All', 'Pending', 'Completed']; track filter) {
              <button (click)="activeFilter.set(filter)"
                class="px-4 py-2 rounded-full text-sm font-medium transition"
                [ngClass]="activeFilter() === filter
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'">
                {{ filter }}
              </button>
            }
          </div>

          <!-- Tasks -->
          <div class="space-y-3">
            @for (todo of filteredTodos(); track todo.id) {
              <div class="bg-white rounded-2xl border shadow-sm p-4 transition-all hover:shadow-md"
                [ngClass]="todo.completed ? 'border-gray-100 opacity-75' : 'border-gray-100'">
                <div class="flex items-start gap-3">

                  <!-- Checkbox -->
                  <button (click)="toggleTodo(todo.id)"
                    class="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    [ngClass]="todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-blue-400'">
                    @if (todo.completed) {
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                      </svg>
                    }
                  </button>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="text-sm font-semibold text-gray-800"
                        [ngClass]="{'line-through text-gray-400': todo.completed}">
                        {{ todo.title }}
                      </p>
                      <!-- Priority Badge -->
                      <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                        [ngClass]="{
                          'bg-red-100 text-red-600':    todo.priority === 'High',
                          'bg-yellow-100 text-yellow-600': todo.priority === 'Medium',
                          'bg-green-100 text-green-600':todo.priority === 'Low'
                        }">{{ todo.priority }}</span>
                      <!-- Tag -->
                      <span class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{{ todo.tag }}</span>
                    </div>
                    @if (todo.description) {
                      <p class="text-xs text-gray-500 mt-1">{{ todo.description }}</p>
                    }
                    <div class="flex items-center gap-3 mt-2">
                      @if (todo.dueDate) {
                        <span class="text-xs text-gray-400 flex items-center gap-1">
                          📅 {{ todo.dueDate | date:'mediumDate' }}
                        </span>
                      }
                      @if (isOverdue(todo)) {
                        <span class="text-xs text-red-500 font-medium">⚠ Overdue</span>
                      }
                    </div>
                  </div>

                  <button (click)="deleteTodo(todo.id)"
                    class="text-gray-300 hover:text-red-400 transition text-lg leading-none shrink-0">✕</button>
                </div>
              </div>
            }

            @if (filteredTodos().length === 0) {
              <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p class="text-4xl mb-3">✅</p>
                <p class="text-gray-500 font-medium">
                  {{ activeFilter() === 'Completed' ? 'No completed tasks yet' : 'All caught up! No pending tasks.' }}
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeTodoComponent {
    activeFilter = signal('All');
    todayDate = new Date().toISOString().split('T')[0];
    tags = ['Work', 'Personal', 'Learning', 'Meeting', 'Review'];

    newTodo = { title: '', description: '', priority: 'Medium' as 'Low' | 'Medium' | 'High', dueDate: '', tag: 'Work' };

    todos = signal<Todo[]>([
        { id: 'T001', title: 'Review PR for auth module', description: 'Check security logic', priority: 'High', dueDate: '2024-04-10', tag: 'Work', completed: false, createdAt: '2024-04-08' },
        { id: 'T002', title: 'Update Jira tickets', description: '', priority: 'Medium', dueDate: '2024-04-09', tag: 'Work', completed: true, createdAt: '2024-04-07' },
        { id: 'T003', title: 'Complete Angular certification', description: 'Module 5 and 6 left', priority: 'Medium', dueDate: '2024-04-20', tag: 'Learning', completed: false, createdAt: '2024-04-06' },
        { id: 'T004', title: 'Team sync meeting prep', description: 'Prepare slides', priority: 'High', dueDate: '2024-04-09', tag: 'Meeting', completed: false, createdAt: '2024-04-08' },
        { id: 'T005', title: 'Submit expense report', description: '', priority: 'Low', dueDate: '2024-04-15', tag: 'Work', completed: true, createdAt: '2024-04-05' },
    ]);

    filteredTodos = computed(() => {
        const f = this.activeFilter();
        return this.todos().filter(t =>
            f === 'All' ? true : f === 'Completed' ? t.completed : !t.completed
        );
    });

    pendingCount = computed(() => this.todos().filter(t => !t.completed).length);
    completedCount = computed(() => this.todos().filter(t => t.completed).length);
    progressPercent = computed(() =>
        this.todos().length === 0 ? 0 : Math.round((this.completedCount() / this.todos().length) * 100)
    );

    todoStats = computed(() => [
        { label: 'Total', count: this.todos().length, dot: 'bg-gray-400' },
        { label: 'Pending', count: this.pendingCount(), dot: 'bg-blue-500' },
        { label: 'Completed', count: this.completedCount(), dot: 'bg-green-500' },
        { label: 'Overdue', count: this.todos().filter(t => this.isOverdue(t)).length, dot: 'bg-red-500' },
    ]);

    addTodo() {
        if (!this.newTodo.title.trim()) return;
        this.todos.update(t => [{
            id: 'T' + Date.now(), ...this.newTodo,
            completed: false, createdAt: new Date().toISOString()
        }, ...t]);
        this.newTodo = { title: '', description: '', priority: 'Medium', dueDate: '', tag: 'Work' };
    }

    toggleTodo(id: string) {
        this.todos.update(t => t.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    }

    deleteTodo(id: string) {
        this.todos.update(t => t.filter(todo => todo.id !== id));
    }

    isOverdue(todo: Todo): boolean {
        return !todo.completed && !!todo.dueDate && todo.dueDate < this.todayDate;
    }
}
import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { LoginComponent } from './modules/auth/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { EmployeesComponent, LeavesComponent, AttendanceComponent } from './modules/hr/hr.components';
import { ProjectsComponent, TasksComponent } from './modules/project/project.components';
import { LeadsComponent } from './modules/sales/leads.component';
import { EmployeeProfileComponent } from './modules/employee/employee-profile.component';
import { UnauthorizedComponent } from './shared/components/unauthorized.component';

export const routes: Routes = [
    // Authentication Routes
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
        ],
    },

    // Dashboard Route
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
    },

    // HR Module Routes
    {
        path: 'hr',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['super-admin', 'admin', 'hr', 'pm', 'tl'] },
        children: [
            {
                path: 'employees',
                component: EmployeesComponent,
            },
            {
                path: 'leaves',
                component: LeavesComponent,
            },
            {
                path: 'attendance',
                component: AttendanceComponent,
            },
            {
                path: '',
                redirectTo: 'employees',
                pathMatch: 'full',
            },
        ],
    },

    // Project Module Routes
    {
        path: 'project',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['super-admin', 'admin', 'pm', 'tl', 'developer'] },
        children: [
            {
                path: 'projects',
                component: ProjectsComponent,
            },
            {
                path: 'tasks',
                component: TasksComponent,
            },
            {
                path: '',
                redirectTo: 'projects',
                pathMatch: 'full',
            },
        ],
    },

    // Sales Module Routes
    {
        path: 'sales',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['super-admin', 'admin', 'sm', 'sales'] },
        children: [
            {
                path: 'leads',
                component: LeadsComponent,
            },
            {
                path: '',
                redirectTo: 'leads',
                pathMatch: 'full',
            },
        ],
    },

    // Employee Module Routes
    {
        path: 'employee',
        canActivate: [authGuard],
        children: [
            {
                path: 'profile',
                component: EmployeeProfileComponent,
            },
            {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full',
            },
        ],
    },

    // Unauthorized Page
    {
        path: 'unauthorized',
        component: UnauthorizedComponent,
    },

    // Default route
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
    },

    // Wildcard
    {
        path: '**',
        redirectTo: '/auth/login',
    },
];

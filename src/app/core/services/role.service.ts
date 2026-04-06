import { Injectable } from '@angular/core';
import { UserRole } from '../models';

export interface RolePermissions {
    canViewAnalytics: boolean;
    canManageUsers: boolean;
    canManageRoles: boolean;
    canViewEmployees: boolean;
    canManageEmployees: boolean;
    canApproveLeaves: boolean;
    canManageLeaves: boolean;
    canCreateProjects: boolean;
    canManageProjects: boolean;
    canViewTasks: boolean;
    canManageTasks: boolean;
    canViewLeads: boolean;
    canManageLeads: boolean;
    canViewDocuments: boolean;
    canUploadDocuments: boolean;
    canViewReports: boolean;
    canGenerateReports: boolean;
    canChangePassword: boolean;
    canViewProfile: boolean;
    canManageAttendance: boolean;
    canApproveAttendance: boolean;
    canViewPerformance: boolean;
    canGivePerformanceReview: boolean;
    canViewSalarySlips: boolean;
    canGenerateSalarySlips: boolean;
    canViewActivityLog: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    private rolePermissions: Record<UserRole, RolePermissions> = {
        'super-admin': {
            canViewAnalytics: true,
            canManageUsers: true,
            canManageRoles: true,
            canViewEmployees: true,
            canManageEmployees: true,
            canApproveLeaves: true,
            canManageLeaves: true,
            canCreateProjects: true,
            canManageProjects: true,
            canViewTasks: true,
            canManageTasks: true,
            canViewLeads: true,
            canManageLeads: true,
            canViewDocuments: true,
            canUploadDocuments: true,
            canViewReports: true,
            canGenerateReports: true,
            canChangePassword: true,
            canViewProfile: true,
            canManageAttendance: true,
            canApproveAttendance: true,
            canViewPerformance: true,
            canGivePerformanceReview: true,
            canViewSalarySlips: true,
            canGenerateSalarySlips: true,
            canViewActivityLog: true,
        },
        admin: {
            canViewAnalytics: true,
            canManageUsers: false,
            canManageRoles: false,
            canViewEmployees: true,
            canManageEmployees: true,
            canApproveLeaves: false,
            canManageLeaves: false,
            canCreateProjects: false,
            canManageProjects: false,
            canViewTasks: true,
            canManageTasks: false,
            canViewLeads: false,
            canManageLeads: false,
            canViewDocuments: false,
            canUploadDocuments: false,
            canViewReports: true,
            canGenerateReports: false,
            canChangePassword: true,
            canViewProfile: true,
            canManageAttendance: true,
            canApproveAttendance: false,
            canViewPerformance: false,
            canGivePerformanceReview: false,
            canViewSalarySlips: false,
            canGenerateSalarySlips: false,
            canViewActivityLog: true,
        },
        hr: {
            canViewAnalytics: false,
            canManageUsers: false,
            canManageRoles: false,
            canViewEmployees: true,
            canManageEmployees: true,
            canApproveLeaves: true,
            canManageLeaves: true,
            canCreateProjects: false,
            canManageProjects: false,
            canViewTasks: false,
            canManageTasks: false,
            canViewLeads: false,
            canManageLeads: false,
            canViewDocuments: true,
            canUploadDocuments: true,
            canViewReports: true,
            canGenerateReports: true,
            canChangePassword: true,
            canViewProfile: true,
            canManageAttendance: true,
            canApproveAttendance: false,
            canViewPerformance: true,
            canGivePerformanceReview: true,
            canViewSalarySlips: true,
            canGenerateSalarySlips: true,
            canViewActivityLog: true,
        },
        pm: {
            canViewAnalytics: true,
            canManageUsers: false,
            canManageRoles: false,
            canViewEmployees: false,
            canManageEmployees: false,
            canApproveLeaves: true,
            canManageLeaves: false,
            canCreateProjects: true,
            canManageProjects: true,
            canViewTasks: true,
            canManageTasks: true,
            canViewLeads: false,
            canManageLeads: false,
            canViewDocuments: false,
            canUploadDocuments: false,
            canViewReports: true,
            canGenerateReports: true,
            canChangePassword: true,
            canViewProfile: true,
            canManageAttendance: false,
            canApproveAttendance: false,
            canViewPerformance: true,
            canGivePerformanceReview: false,
            canViewSalarySlips: false,
            canGenerateSalarySlips: false,
            canViewActivityLog: false,
        },
        tl: {
            canViewAnalytics: false,
            canManageUsers: false,
            canManageRoles: false,
            canViewEmployees: false,
            canManageEmployees: false,
            canApproveLeaves: true,
            canManageLeaves: false,
            canCreateProjects: false,
            canManageProjects: false,
            canViewTasks: true,
            canManageTasks: true,
            canViewLeads: false,
            canManageLeads: false,
            canViewDocuments: false,
            canUploadDocuments: false,
            canViewReports: false,
            canGenerateReports: false,
            canChangePassword: true,
            canViewProfile: true,
            canManageAttendance: true,
            canApproveAttendance: false,
            canViewPerformance: true,
            canGivePerformanceReview: true,
            canViewSalarySlips: false,
            canGenerateSalarySlips: false,
            canViewActivityLog: false,
        },
        developer: {
            canViewAnalytics: false,
            canManageUsers: false,
            canManageRoles: false,
            canViewEmployees: false,
            canManageEmployees: false,
            canApproveLeaves: false,
            canManageLeaves: true,
            canCreateProjects: false,
            canManageProjects: false,
            canViewTasks: true,
            canManageTasks: true,
            canViewLeads: false,
            canManageLeads: false,
            canViewDocuments: true,
            canUploadDocuments: true,
            canViewReports: false,
            canGenerateReports: false,
            canChangePassword: true,
            canViewProfile: true,
            canManageAttendance: true,
            canApproveAttendance: false,
            canViewPerformance: false,
            canGivePerformanceReview: false,
            canViewSalarySlips: true,
            canGenerateSalarySlips: false,
            canViewActivityLog: false,
        },
        sm: {
            canViewAnalytics: true,
            canManageUsers: false,
            canManageRoles: false,
            canViewEmployees: false,
            canManageEmployees: false,
            canApproveLeaves: false,
            canManageLeaves: true,
            canCreateProjects: false,
            canManageProjects: false,
            canViewTasks: false,
            canManageTasks: false,
            canViewLeads: true,
            canManageLeads: true,
            canViewDocuments: false,
            canUploadDocuments: false,
            canViewReports: true,
            canGenerateReports: true,
            canChangePassword: true,
            canViewProfile: true,
            canManageAttendance: false,
            canApproveAttendance: false,
            canViewPerformance: false,
            canGivePerformanceReview: false,
            canViewSalarySlips: false,
            canGenerateSalarySlips: false,
            canViewActivityLog: false,
        },
        sales: {
            canViewAnalytics: false,
            canManageUsers: false,
            canManageRoles: false,
            canViewEmployees: false,
            canManageEmployees: false,
            canApproveLeaves: false,
            canManageLeaves: true,
            canCreateProjects: false,
            canManageProjects: false,
            canViewTasks: false,
            canManageTasks: false,
            canViewLeads: true,
            canManageLeads: true,
            canViewDocuments: false,
            canUploadDocuments: false,
            canViewReports: false,
            canGenerateReports: false,
            canChangePassword: true,
            canViewProfile: true,
            canManageAttendance: true,
            canApproveAttendance: false,
            canViewPerformance: false,
            canGivePerformanceReview: false,
            canViewSalarySlips: true,
            canGenerateSalarySlips: false,
            canViewActivityLog: false,
        },
    };

    getPermissionsForRole(role: UserRole): RolePermissions {
        return this.rolePermissions[role];
    }

    hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
        return this.rolePermissions[role][permission];
    }

    getRoleName(role: UserRole): string {
        const names: Record<UserRole, string> = {
            'super-admin': 'Super Admin',
            admin: 'Admin',
            hr: 'HR Manager',
            pm: 'Project Manager',
            tl: 'Team Leader',
            developer: 'Developer',
            sm: 'Sales Manager',
            sales: 'Sales Team',
        };
        return names[role];
    }

    getRoleColor(role: UserRole): string {
        const colors: Record<UserRole, string> = {
            'super-admin': '#FF6B6B',
            admin: '#4ECDC4',
            hr: '#95E1D3',
            pm: '#F38181',
            tl: '#AA96DA',
            developer: '#FCBAD3',
            sm: '#A8E6CF',
            sales: '#FFD3B6',
        };
        return colors[role];
    }
}

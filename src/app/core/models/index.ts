export type UserRole = 'super-admin' | 'admin' | 'hr' | 'pm' | 'tl' | 'developer' | 'sm' | 'sales';

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    profileImage?: string;
    department?: string;
    joinDate?: string;
    phone?: string;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    user: User;
    expiresIn: number;
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    joinDate: string;
    status: 'active' | 'inactive' | 'on-leave';
    salary?: number;
    manager?: string;
    profileImage?: string;
    reportingTo?: string;
}

export interface Leave {
    id: string;
    employeeId: string;
    employeeName: string;
    type: 'sick' | 'casual' | 'earned' | 'lwp';
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvalDate?: string;
    approvalLevel: 1 | 2 | 3;
}

export interface Attendance {
    id: string;
    employeeId: string;
    date: string;
    checkIn: string;
    checkOut?: string;
    status: 'present' | 'absent' | 'late' | 'early-checkout';
    workingHours?: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    status: 'pending' | 'active' | 'completed' | 'on-hold';
    manager: string;
    team: string[];
    progress: number;
    budget?: number;
    spent?: number;
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    assignedTo: string;
    status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
    priority: 'low' | 'medium' | 'high' | 'critical';
    dueDate: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    estimatedHours?: number;
    actualHours?: number;
}

export interface Lead {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    value?: number;
    assignedTo: string;
    source: string;
    createdAt: string;
    lastInteraction?: string;
    notes?: string;
}

export interface Document {
    id: string;
    employeeId: string;
    type: 'offer-letter' | 'relieving-letter' | 'id-proof' | 'certificate' | 'other';
    name: string;
    uploadDate: string;
    expiryDate?: string;
    filePath: string;
}

export interface PerformanceReview {
    id: string;
    employeeId: string;
    employeeName: string;
    reviewPeriod: string;
    rating: number;
    feedback: string;
    reviewedBy: string;
    reviewDate: string;
    nextReviewDate?: string;
}

export interface SalarySlip {
    id: string;
    employeeId: string;
    employeeName: string;
    month: string;
    year: string;
    baseSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    generatedDate: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
    actionUrl?: string;
}

export interface ActivityLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    module: string;
    timestamp: string;
    details?: string;
    ipAddress?: string;
}

export interface DashboardStats {
    totalEmployees?: number;
    activeProjects?: number;
    pendingLeaves?: number;
    completedTasks?: number;
    totalLeads?: number;
    convertedLeads?: number;
}

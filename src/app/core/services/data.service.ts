import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    Employee,
    Leave,
    Attendance,
    Project,
    Task,
    Lead,
    Document,
    PerformanceReview,
    SalarySlip,
    Notification,
    ActivityLog,
} from '../models';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    // Employees
    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.apiUrl}/hr/employees`);
    }

    getEmployeeById(id: string): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/hr/employees/${id}`);
    }

    addEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(`${this.apiUrl}/hr/employees`, employee);
    }

    updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/hr/employees/${id}`, employee);
    }

    // Leaves
    getLeaves(): Observable<Leave[]> {
        return this.http.get<Leave[]>(`${this.apiUrl}/hr/leaves`);
    }

    getLeavesByEmployee(employeeId: string): Observable<Leave[]> {
        let params = new HttpParams().set('employeeId', employeeId);
        return this.http.get<Leave[]>(`${this.apiUrl}/hr/leaves/by-employee`, { params });
    }

    getPendingLeaves(): Observable<Leave[]> {
        return this.http.get<Leave[]>(`${this.apiUrl}/hr/leaves/pending`);
    }

    addLeave(leave: Leave): Observable<Leave> {
        return this.http.post<Leave>(`${this.apiUrl}/hr/leaves`, leave);
    }

    approveLeave(leaveId: string, approvedBy: string): Observable<Leave> {
        let params = new HttpParams().set('approvedBy', approvedBy);
        return this.http.patch<Leave>(`${this.apiUrl}/hr/leaves/${leaveId}/approve`, null, { params });
    }

    rejectLeave(leaveId: string): Observable<Leave> {
        return this.http.patch<Leave>(`${this.apiUrl}/hr/leaves/${leaveId}/reject`, null);
    }

    // Attendance
    getAttendance(): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(`${this.apiUrl}/hr/attendance`);
    }

    getAttendanceByEmployee(employeeId: string): Observable<Attendance[]> {
        let params = new HttpParams().set('employeeId', employeeId);
        return this.http.get<Attendance[]>(`${this.apiUrl}/hr/attendance/by-employee`, { params });
    }

    checkIn(employeeId: string): Observable<Attendance> {
        let params = new HttpParams().set('employeeId', employeeId);
        return this.http.post<Attendance>(`${this.apiUrl}/hr/attendance/check-in`, null, { params });
    }

    checkOut(attendanceId: string): Observable<Attendance> {
        return this.http.patch<Attendance>(`${this.apiUrl}/hr/attendance/${attendanceId}/check-out`, null);
    }

    // Projects
    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/project/projects`);
    }

    getProjectById(id: string): Observable<Project> {
        return this.http.get<Project>(`${this.apiUrl}/project/projects/${id}`);
    }

    addProject(project: Project): Observable<Project> {
        return this.http.post<Project>(`${this.apiUrl}/project/projects`, project);
    }

    updateProject(id: string, project: Partial<Project>): Observable<Project> {
        return this.http.put<Project>(`${this.apiUrl}/project/projects/${id}`, project);
    }

    // Tasks
    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/project/tasks`);
    }

    getTasksByProject(projectId: string): Observable<Task[]> {
        let params = new HttpParams().set('projectId', projectId);
        return this.http.get<Task[]>(`${this.apiUrl}/project/tasks/by-project`, { params });
    }

    getTasksByAssignee(userId: string): Observable<Task[]> {
        let params = new HttpParams().set('userId', userId);
        return this.http.get<Task[]>(`${this.apiUrl}/project/tasks/by-assignee`, { params });
    }

    addTask(task: Task): Observable<Task> {
        return this.http.post<Task>(`${this.apiUrl}/project/tasks`, task);
    }

    updateTask(id: string, task: Partial<Task>): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/project/tasks/${id}`, task);
    }

    // Leads
    getLeads(): Observable<Lead[]> {
        return this.http.get<Lead[]>(`${this.apiUrl}/sales/leads`);
    }

    getLeadById(id: string): Observable<Lead> {
        return this.http.get<Lead>(`${this.apiUrl}/sales/leads/${id}`);
    }

    addLead(lead: Lead): Observable<Lead> {
        return this.http.post<Lead>(`${this.apiUrl}/sales/leads`, lead);
    }

    updateLead(id: string, lead: Partial<Lead>): Observable<Lead> {
        return this.http.put<Lead>(`${this.apiUrl}/sales/leads/${id}`, lead);
    }

    // Documents
    getDocuments(): Observable<Document[]> {
        return this.http.get<Document[]>(`${this.apiUrl}/docs`);
    }

    getDocumentsByEmployee(employeeId: string): Observable<Document[]> {
        let params = new HttpParams().set('employeeId', employeeId);
        return this.http.get<Document[]>(`${this.apiUrl}/docs/by-employee`, { params });
    }

    addDocument(document: Document): Observable<Document> {
        return this.http.post<Document>(`${this.apiUrl}/docs`, document);
    }

    // Performance Reviews
    getPerformanceReviews(): Observable<PerformanceReview[]> {
        return this.http.get<PerformanceReview[]>(`${this.apiUrl}/performance`);
    }

    getPerformanceReviewsByEmployee(employeeId: string): Observable<PerformanceReview[]> {
        let params = new HttpParams().set('employeeId', employeeId);
        return this.http.get<PerformanceReview[]>(`${this.apiUrl}/performance/by-employee`, { params });
    }

    addPerformanceReview(review: PerformanceReview): Observable<PerformanceReview> {
        return this.http.post<PerformanceReview>(`${this.apiUrl}/performance`, review);
    }

    // Salary Slips
    getSalarySlips(): Observable<SalarySlip[]> {
        return this.http.get<SalarySlip[]>(`${this.apiUrl}/salary-slips`);
    }

    getSalarySlipsByEmployee(employeeId: string): Observable<SalarySlip[]> {
        let params = new HttpParams().set('employeeId', employeeId);
        return this.http.get<SalarySlip[]>(`${this.apiUrl}/salary-slips/by-employee`, { params });
    }

    // Notifications
    getNotifications(userId: string): Observable<Notification[]> {
        let params = new HttpParams().set('userId', userId);
        return this.http.get<Notification[]>(`${this.apiUrl}/notifications`, { params });
    }

    markNotificationAsRead(notificationId: string): Observable<Notification> {
        let params = new HttpParams().set('notificationId', notificationId);
        return this.http.patch<Notification>(`${this.apiUrl}/notifications/mark-read`, null, { params });
    }

    // Activity Logs
    getActivityLogs(): Observable<ActivityLog[]> {
        return this.http.get<ActivityLog[]>(`${this.apiUrl}/activity-logs`);
    }

    addActivityLog(log: ActivityLog): Observable<ActivityLog> {
        return this.http.post<ActivityLog>(`${this.apiUrl}/activity-logs`, log);
    }
}

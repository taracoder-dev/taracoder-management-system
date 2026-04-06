import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
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
    private mockEmployees: Employee[] = [
        {
            id: '1',
            name: 'John Doe',
            email: 'john@taracoder.com',
            phone: '9876543210',
            department: 'Development',
            position: 'Senior Developer',
            joinDate: '2022-01-15',
            status: 'active',
            salary: 75000,
            reportingTo: 'Team Leader',
            profileImage: 'assets/avatars/john.jpg',
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@taracoder.com',
            phone: '9876543211',
            department: 'HR',
            position: 'HR Manager',
            joinDate: '2021-06-20',
            status: 'active',
            salary: 55000,
            reportingTo: 'Admin',
            profileImage: 'assets/avatars/jane.jpg',
        },
        {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@taracoder.com',
            phone: '9876543212',
            department: 'Sales',
            position: 'Sales Manager',
            joinDate: '2022-03-10',
            status: 'active',
            salary: 60000,
            reportingTo: 'Super Admin',
            profileImage: 'assets/avatars/mike.jpg',
        },
    ];

    private mockLeaves: Leave[] = [
        {
            id: 'L1',
            employeeId: '1',
            employeeName: 'John Doe',
            type: 'casual',
            startDate: '2024-04-10',
            endDate: '2024-04-12',
            days: 3,
            reason: 'Personal work',
            status: 'pending',
            approvalLevel: 1,
        },
        {
            id: 'L2',
            employeeId: '2',
            employeeName: 'Jane Smith',
            type: 'sick',
            startDate: '2024-04-08',
            endDate: '2024-04-08',
            days: 1,
            reason: 'Medical appointment',
            status: 'approved',
            approvedBy: 'HR Manager',
            approvalLevel: 3,
            approvalDate: '2024-04-07',
        },
    ];

    private mockAttendance: Attendance[] = [
        {
            id: 'A1',
            employeeId: '1',
            date: '2024-04-05',
            checkIn: '09:15',
            checkOut: '18:30',
            status: 'present',
            workingHours: 9.25,
        },
        {
            id: 'A2',
            employeeId: '1',
            date: '2024-04-04',
            checkIn: '09:45',
            checkOut: '18:00',
            status: 'late',
            workingHours: 8.25,
        },
    ];

    private mockProjects: Project[] = [
        {
            id: 'P1',
            name: 'E-Commerce Platform',
            description: 'Building a modern e-commerce platform',
            startDate: '2024-01-01',
            endDate: '2024-06-30',
            status: 'active',
            manager: 'PM Manager',
            team: ['1', '2', '3'],
            progress: 65,
            budget: 500000,
            spent: 325000,
        },
        {
            id: 'P2',
            name: 'Mobile App',
            description: 'Native mobile application development',
            startDate: '2024-02-15',
            status: 'active',
            manager: 'PM Manager',
            team: ['1', '3'],
            progress: 45,
            budget: 300000,
            spent: 135000,
        },
    ];

    private mockTasks: Task[] = [
        {
            id: 'T1',
            projectId: 'P1',
            title: 'Frontend Design Implementation',
            description: 'Implement UI components for dashboard',
            assignedTo: '1',
            status: 'in-progress',
            priority: 'high',
            dueDate: '2024-04-15',
            createdBy: 'PM Manager',
            createdAt: '2024-03-20',
            updatedAt: '2024-04-05',
            estimatedHours: 40,
            actualHours: 32,
        },
        {
            id: 'T2',
            projectId: 'P1',
            title: 'Database Schema Design',
            description: 'Design database schema for e-commerce',
            assignedTo: '2',
            status: 'completed',
            priority: 'critical',
            dueDate: '2024-04-10',
            createdBy: 'PM Manager',
            createdAt: '2024-03-15',
            updatedAt: '2024-04-06',
            estimatedHours: 20,
            actualHours: 18,
        },
    ];

    private mockLeads: Lead[] = [
        {
            id: 'LD1',
            companyName: 'Tech Corp',
            contactPerson: 'Robert Williams',
            email: 'robert@techcorp.com',
            phone: '9876543213',
            status: 'qualified',
            value: 50000,
            assignedTo: 'Sales Manager',
            source: 'LinkedIn',
            createdAt: '2024-04-01',
            lastInteraction: '2024-04-05',
            notes: 'Very interested in our services',
        },
        {
            id: 'LD2',
            companyName: 'Innovation Labs',
            contactPerson: 'Sarah Davis',
            email: 'sarah@innovlabs.com',
            phone: '9876543214',
            status: 'new',
            value: 30000,
            assignedTo: 'Sales Team',
            source: 'Email Campaign',
            createdAt: '2024-04-03',
        },
    ];

    private mockDocuments: Document[] = [
        {
            id: 'D1',
            employeeId: '1',
            type: 'offer-letter',
            name: 'Offer Letter - John Doe',
            uploadDate: '2022-01-10',
            filePath: '/documents/offer-letter-john.pdf',
        },
    ];

    private mockPerformanceReviews: PerformanceReview[] = [
        {
            id: 'PR1',
            employeeId: '1',
            employeeName: 'John Doe',
            reviewPeriod: 'Q1 2024',
            rating: 4.5,
            feedback: 'Excellent work on the project. Great team player.',
            reviewedBy: 'Team Leader',
            reviewDate: '2024-04-03',
            nextReviewDate: '2024-07-03',
        },
    ];

    private mockSalarySlips: SalarySlip[] = [
        {
            id: 'SS1',
            employeeId: '1',
            employeeName: 'John Doe',
            month: 'April',
            year: '2024',
            baseSalary: 75000,
            allowances: 10000,
            deductions: 15000,
            netSalary: 70000,
            generatedDate: '2024-04-01',
        },
    ];

    private mockNotifications: Notification[] = [
        {
            id: 'N1',
            userId: '1',
            title: 'Leave Approved',
            message: 'Your leave request for April 10-12 has been approved.',
            type: 'success',
            read: false,
            createdAt: '2024-04-05T10:30:00',
        },
    ];

    private mockActivityLogs: ActivityLog[] = [
        {
            id: 'AL1',
            userId: '1',
            userName: 'John Doe',
            action: 'Login',
            module: 'Authentication',
            timestamp: '2024-04-05T09:00:00',
            ipAddress: '192.168.1.100',
        },
        {
            id: 'AL2',
            userId: '1',
            userName: 'John Doe',
            action: 'Updated task status',
            module: 'Project',
            timestamp: '2024-04-05T10:15:00',
            details: 'Task T1 marked as In Progress',
        },
    ];

    // Employees
    getEmployees(): Observable<Employee[]> {
        return of([...this.mockEmployees]).pipe(delay(300));
    }

    getEmployeeById(id: string): Observable<Employee | undefined> {
        return of(this.mockEmployees.find((emp) => emp.id === id)).pipe(delay(200));
    }

    addEmployee(employee: Employee): Observable<Employee> {
        const newEmployee = { ...employee, id: Date.now().toString() };
        this.mockEmployees.push(newEmployee);
        return of(newEmployee).pipe(delay(300));
    }

    updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee | undefined> {
        const index = this.mockEmployees.findIndex((emp) => emp.id === id);
        if (index !== -1) {
            this.mockEmployees[index] = { ...this.mockEmployees[index], ...employee };
        }
        return of(this.mockEmployees[index]).pipe(delay(300));
    }

    // Leaves
    getLeaves(): Observable<Leave[]> {
        return of([...this.mockLeaves]).pipe(delay(300));
    }

    getLeavesByEmployee(employeeId: string): Observable<Leave[]> {
        return of(this.mockLeaves.filter((leave) => leave.employeeId === employeeId)).pipe(delay(300));
    }

    getPendingLeaves(): Observable<Leave[]> {
        return of(this.mockLeaves.filter((leave) => leave.status === 'pending')).pipe(delay(300));
    }

    addLeave(leave: Leave): Observable<Leave> {
        const newLeave = { ...leave, id: `L${Date.now()}` };
        this.mockLeaves.push(newLeave);
        return of(newLeave).pipe(delay(300));
    }

    approveLeave(leaveId: string, approvedBy: string): Observable<Leave | undefined> {
        const leave = this.mockLeaves.find((l) => l.id === leaveId);
        if (leave) {
            leave.status = 'approved';
            leave.approvedBy = approvedBy;
            leave.approvalDate = new Date().toISOString().split('T')[0];
        }
        return of(leave).pipe(delay(300));
    }

    rejectLeave(leaveId: string): Observable<Leave | undefined> {
        const leave = this.mockLeaves.find((l) => l.id === leaveId);
        if (leave) {
            leave.status = 'rejected';
        }
        return of(leave).pipe(delay(300));
    }

    // Attendance
    getAttendance(): Observable<Attendance[]> {
        return of([...this.mockAttendance]).pipe(delay(300));
    }

    getAttendanceByEmployee(employeeId: string): Observable<Attendance[]> {
        return of(this.mockAttendance.filter((att) => att.employeeId === employeeId)).pipe(delay(300));
    }

    checkIn(employeeId: string): Observable<Attendance> {
        const now = new Date();
        const checkInTime = now.toTimeString().split(' ')[0];
        const attendance: Attendance = {
            id: `A${Date.now()}`,
            employeeId,
            date: now.toISOString().split('T')[0],
            checkIn: checkInTime,
            status: checkInTime > '09:00' ? 'late' : 'present',
        };
        this.mockAttendance.push(attendance);
        return of(attendance).pipe(delay(300));
    }

    checkOut(attendanceId: string): Observable<Attendance | undefined> {
        const attendance = this.mockAttendance.find((att) => att.id === attendanceId);
        if (attendance) {
            const now = new Date();
            attendance.checkOut = now.toTimeString().split(' ')[0];
            const checkIn = new Date(`2024-01-01 ${attendance.checkIn}`);
            const checkOut = new Date(`2024-01-01 ${attendance.checkOut}`);
            attendance.workingHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        }
        return of(attendance).pipe(delay(300));
    }

    // Projects
    getProjects(): Observable<Project[]> {
        return of([...this.mockProjects]).pipe(delay(300));
    }

    getProjectById(id: string): Observable<Project | undefined> {
        return of(this.mockProjects.find((proj) => proj.id === id)).pipe(delay(300));
    }

    addProject(project: Project): Observable<Project> {
        const newProject = { ...project, id: `P${Date.now()}` };
        this.mockProjects.push(newProject);
        return of(newProject).pipe(delay(300));
    }

    updateProject(id: string, project: Partial<Project>): Observable<Project | undefined> {
        const index = this.mockProjects.findIndex((p) => p.id === id);
        if (index !== -1) {
            this.mockProjects[index] = { ...this.mockProjects[index], ...project };
        }
        return of(this.mockProjects[index]).pipe(delay(300));
    }

    // Tasks
    getTasks(): Observable<Task[]> {
        return of([...this.mockTasks]).pipe(delay(300));
    }

    getTasksByProject(projectId: string): Observable<Task[]> {
        return of(this.mockTasks.filter((task) => task.projectId === projectId)).pipe(delay(300));
    }

    getTasksByAssignee(userId: string): Observable<Task[]> {
        return of(this.mockTasks.filter((task) => task.assignedTo === userId)).pipe(delay(300));
    }

    addTask(task: Task): Observable<Task> {
        const newTask = { ...task, id: `T${Date.now()}` };
        this.mockTasks.push(newTask);
        return of(newTask).pipe(delay(300));
    }

    updateTask(id: string, task: Partial<Task>): Observable<Task | undefined> {
        const index = this.mockTasks.findIndex((t) => t.id === id);
        if (index !== -1) {
            this.mockTasks[index] = { ...this.mockTasks[index], ...task, updatedAt: new Date().toISOString() };
        }
        return of(this.mockTasks[index]).pipe(delay(300));
    }

    // Leads
    getLeads(): Observable<Lead[]> {
        return of([...this.mockLeads]).pipe(delay(300));
    }

    getLeadById(id: string): Observable<Lead | undefined> {
        return of(this.mockLeads.find((lead) => lead.id === id)).pipe(delay(300));
    }

    addLead(lead: Lead): Observable<Lead> {
        const newLead = { ...lead, id: `LD${Date.now()}` };
        this.mockLeads.push(newLead);
        return of(newLead).pipe(delay(300));
    }

    updateLead(id: string, lead: Partial<Lead>): Observable<Lead | undefined> {
        const index = this.mockLeads.findIndex((l) => l.id === id);
        if (index !== -1) {
            this.mockLeads[index] = { ...this.mockLeads[index], ...lead };
        }
        return of(this.mockLeads[index]).pipe(delay(300));
    }

    // Documents
    getDocuments(): Observable<Document[]> {
        return of([...this.mockDocuments]).pipe(delay(300));
    }

    getDocumentsByEmployee(employeeId: string): Observable<Document[]> {
        return of(this.mockDocuments.filter((doc) => doc.employeeId === employeeId)).pipe(delay(300));
    }

    addDocument(document: Document): Observable<Document> {
        const newDocument = { ...document, id: `D${Date.now()}` };
        this.mockDocuments.push(newDocument);
        return of(newDocument).pipe(delay(300));
    }

    // Performance Reviews
    getPerformanceReviews(): Observable<PerformanceReview[]> {
        return of([...this.mockPerformanceReviews]).pipe(delay(300));
    }

    getPerformanceReviewsByEmployee(employeeId: string): Observable<PerformanceReview[]> {
        return of(this.mockPerformanceReviews.filter((pr) => pr.employeeId === employeeId)).pipe(delay(300));
    }

    addPerformanceReview(review: PerformanceReview): Observable<PerformanceReview> {
        const newReview = { ...review, id: `PR${Date.now()}` };
        this.mockPerformanceReviews.push(newReview);
        return of(newReview).pipe(delay(300));
    }

    // Salary Slips
    getSalarySlips(): Observable<SalarySlip[]> {
        return of([...this.mockSalarySlips]).pipe(delay(300));
    }

    getSalarySlipsByEmployee(employeeId: string): Observable<SalarySlip[]> {
        return of(this.mockSalarySlips.filter((slip) => slip.employeeId === employeeId)).pipe(delay(300));
    }

    // Notifications
    getNotifications(userId: string): Observable<Notification[]> {
        return of(this.mockNotifications.filter((notif) => notif.userId === userId)).pipe(delay(300));
    }

    markNotificationAsRead(notificationId: string): Observable<Notification | undefined> {
        const notification = this.mockNotifications.find((n) => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
        return of(notification).pipe(delay(200));
    }

    // Activity Logs
    getActivityLogs(): Observable<ActivityLog[]> {
        return of([...this.mockActivityLogs]).pipe(delay(300));
    }

    addActivityLog(log: ActivityLog): Observable<ActivityLog> {
        const newLog = { ...log, id: `AL${Date.now()}` };
        this.mockActivityLogs.push(newLog);
        return of(newLog).pipe(delay(200));
    }
}

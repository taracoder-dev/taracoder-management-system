import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, UserRole, LoginResponse, AuthCredentials } from '../models';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private currentUser = signal<User | null>(null);
    private isAuthenticated = signal(false);
    private authToken = signal<string | null>(null);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            this.loadUserFromSession();
        }
    }

    // ✅ Mock credentials database
    private mockCredentials: Record<string, { password: string; user: User }> = {
        'super@taracoder.com': {
            password: '123456',
            user: {
                id: '1',
                email: 'super@taracoder.com',
                name: 'Super Admin',
                role: 'super-admin' as UserRole,
                department: 'Management',
                profileImage: 'assets/avatars/super-admin.jpg',
                joinDate: '2023-01-01',
            },
        },
        'admin@taracoder.com': {
            password: '123456',
            user: {
                id: '2',
                email: 'admin@taracoder.com',
                name: 'Admin User',
                role: 'admin' as UserRole,
                department: 'Operations',
                profileImage: 'assets/avatars/admin.jpg',
                joinDate: '2023-02-01',
            },
        },
        'hr@taracoder.com': {
            password: '123456',
            user: {
                id: '3',
                email: 'hr@taracoder.com',
                name: 'HR Manager',
                role: 'hr' as UserRole,
                department: 'Human Resources',
                profileImage: 'assets/avatars/hr.jpg',
                joinDate: '2023-03-01',
            },
        },
        'pm@taracoder.com': {
            password: '123456',
            user: {
                id: '4',
                email: 'pm@taracoder.com',
                name: 'Project Manager',
                role: 'pm' as UserRole,
                department: 'Project Management',
                profileImage: 'assets/avatars/pm.jpg',
                joinDate: '2023-04-01',
            },
        },
        'tl@taracoder.com': {
            password: '123456',
            user: {
                id: '5',
                email: 'tl@taracoder.com',
                name: 'Team Leader',
                role: 'tl' as UserRole,
                department: 'Development',
                profileImage: 'assets/avatars/tl.jpg',
                joinDate: '2023-05-01',
            },
        },
        'dev@taracoder.com': {
            password: '123456',
            user: {
                id: '6',
                email: 'dev@taracoder.com',
                name: 'Software Developer',
                role: 'developer' as UserRole,
                department: 'Development',
                profileImage: 'assets/avatars/developer.jpg',
                joinDate: '2023-06-01',
            },
        },
        'sm@taracoder.com': {
            password: '123456',
            user: {
                id: '7',
                email: 'sm@taracoder.com',
                name: 'Sales Manager',
                role: 'sm' as UserRole,
                department: 'Sales',
                profileImage: 'assets/avatars/sales-manager.jpg',
                joinDate: '2023-07-01',
            },
        },
        'sales@taracoder.com': {
            password: '123456',
            user: {
                id: '8',
                email: 'sales@taracoder.com',
                name: 'Sales Team Member',
                role: 'sales' as UserRole,
                department: 'Sales',
                profileImage: 'assets/avatars/sales.jpg',
                joinDate: '2023-08-01',
            },
        },
    };

    // ✅ Signals (readonly)
    currentUserSignal = this.currentUser.asReadonly();
    isAuthenticatedSignal = this.isAuthenticated.asReadonly();
    authTokenSignal = this.authToken.asReadonly();

    // ✅ LOGIN
    login(credentials: AuthCredentials): LoginResponse {
        const email = credentials.email.trim().toLowerCase();
        const mockUser = this.mockCredentials[email];

        if (!mockUser || mockUser.password !== credentials.password) {
            throw new Error('Invalid email or password');
        }

        const token = this.generateMockToken(mockUser.user);

        const response: LoginResponse = {
            token,
            user: mockUser.user,
            expiresIn: 3600,
        };

        this.setSession(response);
        return response;
    }

    // ✅ LOGOUT
    logout(): void {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.authToken.set(null);

        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('current_user');
        }
    }

    // ✅ GETTERS
    getCurrentUser(): User | null {
        return this.currentUser();
    }

    isLoggedIn(): boolean {
        return this.isAuthenticated();
    }

    getToken(): string | null {
        return this.authToken();
    }

    // ✅ SESSION SET
    private setSession(response: LoginResponse): void {
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
        this.authToken.set(response.token);

        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem('auth_token', response.token);
            sessionStorage.setItem('current_user', JSON.stringify(response.user));
        }
    }

    // ✅ LOAD SESSION (SSR SAFE)
    private loadUserFromSession(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const token = sessionStorage.getItem('auth_token');
        const userJson = sessionStorage.getItem('current_user');

        if (token && userJson) {
            try {
                const user = JSON.parse(userJson) as User;

                this.currentUser.set(user);
                this.isAuthenticated.set(true);
                this.authToken.set(token);
            } catch {
                this.logout();
            }
        }
    }

    // ✅ TOKEN GENERATION (SAFE)
    private generateMockToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            iat: Date.now(),
            exp: Date.now() + 3600 * 1000,
        };

        return encodeURIComponent(JSON.stringify(payload));
    }

    // ✅ ROLE CHECK
    hasRole(role: UserRole | UserRole[]): boolean {
        const user = this.currentUser();
        if (!user) return false;

        return Array.isArray(role)
            ? role.includes(user.role as UserRole)
            : user.role === role;
    }

    hasAnyPermission(roles: UserRole[]): boolean {
        return this.hasRole(roles);
    }
}
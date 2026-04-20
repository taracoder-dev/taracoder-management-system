import { Injectable, signal, inject, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole, LoginResponse, AuthCredentials } from '../models';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private currentUser = signal<User | null>(null);
    private isAuthenticated = signal(false);
    private authToken = signal<string | null>(null);
    private http = inject(HttpClient);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            this.loadUserFromSession();
        }
    }

    // ✅ Signals (readonly)
    currentUserSignal = this.currentUser.asReadonly();
    isAuthenticatedSignal = this.isAuthenticated.asReadonly();
    authTokenSignal = this.authToken.asReadonly();

    // ✅ LOGIN
    login(credentials: AuthCredentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
            tap(response => this.setSession(response))
        );
    }

    // ✅ LOGOUT
    logout(): void {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.authToken.set(null);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user');
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
        this.authToken.set(response.accessToken);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('auth_token', response.accessToken);
            localStorage.setItem('current_user', JSON.stringify(response.user));
        }
    }

    // ✅ LOAD SESSION (SSR SAFE)
    private loadUserFromSession(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const token = localStorage.getItem('auth_token');
        const userJson = localStorage.getItem('current_user');

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
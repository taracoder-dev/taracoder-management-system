import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';


// ✅ AUTH GUARD (Check Login)
export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    if (authService.isLoggedIn()) {
        return true;
    }

    return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });
};


// ✅ ROLE GUARD (RBAC)
export const roleGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    // 🔒 Not logged in
    if (!authService.isLoggedIn()) {
        return router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url }
        });
    }

    const requiredRoles = route.data['roles'] as UserRole[] | undefined;

    // ✅ No role restriction
    if (!requiredRoles || requiredRoles.length === 0) {
        return true;
    }

    // ✅ Role matched
    if (authService.hasRole(requiredRoles)) {
        return true;
    }

    // ❌ Unauthorized
    return router.createUrlTree(['/unauthorized']);
};


// ✅ NO AUTH GUARD (Prevent logged-in user from login page)
@Injectable({
    providedIn: 'root',
})
export class NoAuthGuard {

    constructor(
        private authService: AuthService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    canActivate(): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return true;
        }

        if (!this.authService.isLoggedIn()) {
            return true;
        }

        this.router.navigate(['/dashboard']);
        return false;
    }
}
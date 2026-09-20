import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from '../auth/services/auth.service';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getToken',
      'loadCurrentUser',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow access if user is authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/profile' } as RouterStateSnapshot)
    );

    expect(result).toBeTrue();
  });

  it('should redirect to login if not authenticated and no token', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    authServiceSpy.getToken.and.returnValue(null);

    const dummyUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(dummyUrlTree);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/profile' } as RouterStateSnapshot)
    );

    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/'], {
      queryParams: { returnUrl: '/profile' },
    });
    expect(result).toBe(dummyUrlTree);
  });
});

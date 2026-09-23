import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorage.clear();
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created and initial state unauthenticated when localStorage is empty', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
  });

  it('should store and retrieve token in localStorage', () => {
    service.setToken('test-token-123');
    expect(service.getToken()).toBe('test-token-123');
    expect(localStorage.getItem('codequest_token')).toBe('test-token-123');

    service.clearToken();
    expect(service.getToken()).toBeNull();
  });

  it('should store and retrieve user profile in localStorage', () => {
    const mockUser = {
      id: 5,
      discord_id: 'discord-555',
      name: 'Persisted Dev',
      email: 'persisted@test.com',
      avatar: null,
    };

    service.setStoredUser(mockUser);
    expect(service.getStoredUser()).toEqual(mockUser);
    expect(localStorage.getItem('codequest_user')).toContain('Persisted Dev');

    service.clearStoredUser();
    expect(service.getStoredUser()).toBeNull();
  });

  it('should synchronously rehydrate user profile from localStorage on initialization', () => {
    const cachedUser = {
      id: 10,
      discord_id: 'cached-10',
      name: 'Cached User',
      email: 'cached@test.com',
      avatar: 'https://avatar.png',
    };
    localStorage.setItem('codequest_user', JSON.stringify(cachedUser));
    localStorage.setItem('codequest_token', 'cached-token');

    // Create a new instance with cached storage
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
      ],
    });

    const rehydratedService = TestBed.inject(AuthService);
    const localHttpMock = TestBed.inject(HttpTestingController);

    // Synchronously available immediately!
    expect(rehydratedService.isAuthenticated()).toBeTrue();
    expect(rehydratedService.currentUser()?.name).toBe('Cached User');

    // Background validation request to /api/auth/user
    const req = localHttpMock.expectOne(`${environment.apiUrl}/auth/user`);
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'ok', data: cachedUser });

    localHttpMock.verify();
  });

  it('should mockLogin and update state to authenticated and persist to localStorage', () => {
    const mockUser = {
      id: 1,
      discord_id: 'discord-123',
      name: 'Test Dev',
      email: 'test@codequest.dev',
      avatar: 'https://avatar.png',
    };

    service.mockLogin().subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.currentUser()?.name).toBe('Test Dev');
      expect(localStorage.getItem('codequest_user')).toContain('Test Dev');
      expect(localStorage.getItem('codequest_token')).toBe('mock-bearer-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/mock-login`);
    expect(req.request.method).toBe('GET');
    req.flush({
      status: 'ok',
      token: 'mock-bearer-token',
      user: mockUser,
    });
  });

  it('should logout by revoking token and clearing state and localStorage', () => {
    service.setToken('active-token');
    service.setStoredUser({
      id: 1,
      discord_id: '123',
      name: 'Active User',
      email: 'active@test.com',
      avatar: null,
    });

    service.logout();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'ok', message: 'Sesión cerrada' });

    expect(service.getToken()).toBeNull();
    expect(service.getStoredUser()).toBeNull();
    expect(localStorage.getItem('codequest_user')).toBeNull();
    expect(localStorage.getItem('codequest_token')).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle auth callback and persist current user', () => {
    const mockUser = {
      id: 2,
      discord_id: '999',
      name: 'Callback User',
      email: 'callback@test.com',
      avatar: null,
    };

    service.handleAuthCallback('token-from-oauth').subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(service.isAuthenticated()).toBeTrue();
      expect(localStorage.getItem('codequest_user')).toContain('Callback User');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/user`);
    expect(req.request.method).toBe('GET');
    req.flush({
      status: 'ok',
      data: mockUser,
    });
  });
});

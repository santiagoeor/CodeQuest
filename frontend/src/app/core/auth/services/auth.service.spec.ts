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

  it('should be created and initial state unauthenticated', () => {
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

  it('should mockLogin and update state to authenticated', () => {
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
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/mock-login`);
    expect(req.request.method).toBe('GET');
    req.flush({
      status: 'ok',
      token: 'mock-bearer-token',
      user: mockUser,
    });
  });

  it('should logout by revoking token and clearing state', () => {
    service.setToken('active-token');

    service.logout();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'ok', message: 'Sesión cerrada' });

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle auth callback and load current user', () => {
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
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/user`);
    expect(req.request.method).toBe('GET');
    req.flush({
      status: 'ok',
      data: mockUser,
    });
  });
});

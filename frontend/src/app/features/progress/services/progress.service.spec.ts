import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProgressService } from './progress.service';
import { environment } from '../../../../environments/environment';
import { PathProgressMetrics, ProgressApiResponse, ToggleProgressData } from '../models/progress.model';

describe('ProgressService', () => {
  let service: ProgressService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProgressService],
    });

    service = TestBed.inject(ProgressService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created with initial default state', () => {
    expect(service).toBeTruthy();
    expect(service.completedCourseIds().size).toBe(0);
    expect(service.metricsByPath().size).toBe(0);
    expect(service.isCourseCompleted(1)).toBeFalse();
  });

  it('should load path progress metrics and update signals (AC-2)', () => {
    const mockMetrics: PathProgressMetrics = {
      learning_path_id: 10,
      total_courses_count: 4,
      completed_courses_count: 2,
      progress_percentage: 50.0,
      completed_course_ids: [101, 102],
    };

    const mockResponse: ProgressApiResponse<PathProgressMetrics> = {
      status: 'ok',
      data: mockMetrics,
    };

    service.loadPathProgress(10).subscribe((res) => {
      expect(res).toEqual(mockMetrics);
      expect(service.isCourseCompleted(101)).toBeTrue();
      expect(service.isCourseCompleted(102)).toBeTrue();
      expect(service.isCourseCompleted(103)).toBeFalse();
      expect(service.getPathMetrics(10)?.progress_percentage).toBe(50.0);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/progress?learning_path_id=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should perform optimistic toggle and confirm from backend (AC-1, AC-3)', () => {
    const pathCourseIds = [1, 2, 3, 4];
    expect(service.isCourseCompleted(1)).toBeFalse();

    const mockToggleData: ToggleProgressData = {
      course_id: 1,
      is_completed: true,
      completed_at: '2026-09-22T21:00:00Z',
      learning_path_id: 5,
      total_courses_count: 4,
      completed_courses_count: 1,
      progress_percentage: 25.0,
      completed_course_ids: [1],
    };

    const mockResponse: ProgressApiResponse<ToggleProgressData> = {
      status: 'ok',
      message: 'Progreso actualizado',
      data: mockToggleData,
    };

    // Subscribing to toggle
    service.toggleCourseProgress(1, 5, pathCourseIds).subscribe((data) => {
      expect(data.is_completed).toBeTrue();
      expect(service.isCourseCompleted(1)).toBeTrue();
      expect(service.getPathMetrics(5)?.progress_percentage).toBe(25.0);
    });

    // Before HTTP response returns, optimistic state should already be true!
    expect(service.isCourseCompleted(1)).toBeTrue();
    expect(service.getPathMetrics(5)?.progress_percentage).toBe(25.0);

    const req = httpMock.expectOne(`${environment.apiUrl}/progress/toggle`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ course_id: 1, learning_path_id: 5 });
    req.flush(mockResponse);
  });

  it('should rollback optimistic update when backend returns error (AC-3)', () => {
    const pathCourseIds = [1, 2];
    expect(service.isCourseCompleted(1)).toBeFalse();

    service.toggleCourseProgress(1, 5, pathCourseIds).subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    // Before error: optimistically marked
    expect(service.isCourseCompleted(1)).toBeTrue();

    const req = httpMock.expectOne(`${environment.apiUrl}/progress/toggle`);
    req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });

    // After error: rolled back to false!
    expect(service.isCourseCompleted(1)).toBeFalse();
  });

  it('should identify when a path is 100% completed (AC-4)', () => {
    const mockMetrics: PathProgressMetrics = {
      learning_path_id: 7,
      total_courses_count: 3,
      completed_courses_count: 3,
      progress_percentage: 100.0,
      completed_course_ids: [1, 2, 3],
    };

    service.metricsByPath.set(new Map([[7, mockMetrics]]));
    expect(service.isPathFullyCompleted(7)).toBeTrue();

    // Not completed path
    const incompleteMetrics: PathProgressMetrics = {
      learning_path_id: 8,
      total_courses_count: 3,
      completed_courses_count: 2,
      progress_percentage: 66.7,
      completed_course_ids: [1, 2],
    };
    service.metricsByPath.set(new Map([[8, incompleteMetrics]]));
    expect(service.isPathFullyCompleted(8)).toBeFalse();
  });
});

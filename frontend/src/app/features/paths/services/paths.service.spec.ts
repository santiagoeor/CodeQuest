import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PathsService } from './paths.service';
import { environment } from '../../../../environments/environment';
import { LearningPath, LearningPathsResponse, SingleLearningPathResponse } from '../models/path.model';

describe('PathsService', () => {
  let service: PathsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/learning-paths`;

  const mockPath: LearningPath = {
    id: 1,
    user_id: 10,
    title: 'Ruta Frontend DevTalles',
    description: 'Secuencia para aprender React y TypeScript',
    level: 'beginner',
    status: 'active',
    created_at: '2026-09-22T00:00:00Z',
    updated_at: '2026-09-22T00:00:00Z',
    courses: [
      {
        id: 101,
        title: 'JavaScript Moderno',
        slug: 'javascript-moderno',
        description: 'Fundamentos de JS',
        level: 'beginner',
        duration: '28 horas',
        url: 'https://cursos.devtalles.com/courses/javascript-moderno',
        image_url: 'https://devtalles.com/js.png',
        tags: ['JavaScript', 'Frontend'],
        pivot: {
          order: 1,
          status: 'pending',
          course_id: 101,
          learning_path_id: 1,
        },
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PathsService],
    });

    service = TestBed.inject(PathsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created with initial empty signals', () => {
    expect(service).toBeTruthy();
    expect(service.paths().length).toBe(0);
    expect(service.currentPath()).toBeNull();
    expect(service.isLoading()).toBeFalse();
    expect(service.error()).toBeNull();
  });

  it('should load all user learning paths via GET', () => {
    const mockResponse: LearningPathsResponse = {
      status: 'ok',
      count: 1,
      data: [mockPath],
    };

    service.loadUserPaths().subscribe((paths) => {
      expect(paths.length).toBe(1);
      expect(paths[0].id).toBe(1);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.paths().length).toBe(1);
    expect(service.currentPath()?.id).toBe(1);
    expect(service.isLoading()).toBeFalse();
  });

  it('should load single path by id via GET', () => {
    const mockResponse: SingleLearningPathResponse = {
      status: 'ok',
      data: mockPath,
    };

    service.loadPathById(1).subscribe((path) => {
      expect(path?.title).toBe('Ruta Frontend DevTalles');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.currentPath()?.id).toBe(1);
  });

  it('should persist a new path via POST and prepend to paths', () => {
    const newPath: LearningPath = {
      ...mockPath,
      id: 2,
      title: 'Ruta Backend NestJS',
    };

    const mockResponse: SingleLearningPathResponse = {
      status: 'ok',
      data: newPath,
    };

    service.savePath({
      title: 'Ruta Backend NestJS',
      level: 'intermediate',
      courses: [{ id: 101, order: 1 }],
    }).subscribe((saved) => {
      expect(saved.id).toBe(2);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.paths().length).toBe(1);
    expect(service.paths()[0].id).toBe(2);
    expect(service.currentPath()?.id).toBe(2);
  });

  it('should delete a learning path via DELETE and update state', () => {
    service.paths.set([mockPath]);
    service.currentPath.set(mockPath);

    service.deletePath(1).subscribe((success) => {
      expect(success).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ status: 'ok', message: 'Ruta eliminada' });

    expect(service.paths().length).toBe(0);
    expect(service.currentPath()).toBeNull();
  });
});

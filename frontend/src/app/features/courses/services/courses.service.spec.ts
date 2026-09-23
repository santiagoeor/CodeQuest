import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from './courses.service';
import { environment } from '../../../../environments/environment';
import { Course, CoursesResponse, CreateCourseDto, SingleCourseResponse, UpdateCourseDto } from '../models/course.model';

describe('CoursesService', () => {
  let service: CoursesService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/courses`;

  const mockCourse: Course = {
    id: 1,
    title: 'Angular: De Cero a Experto',
    slug: 'angular-de-cero-a-experto',
    description: 'Aprende Angular con Fernando Herrera desde bases hasta conceptos avanzados.',
    level: 'intermediate',
    duration: '35 horas',
    url: 'https://cursos.devtalles.com/courses/angular',
    image_url: 'https://devtalles.com/angular.png',
    tags: [{ id: 1, name: 'Angular' }, { id: 2, name: 'TypeScript' }],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    service = TestBed.inject(CoursesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created with initial empty signals', () => {
    expect(service).toBeTruthy();
    expect(service.courses().length).toBe(0);
    expect(service.isLoading()).toBeFalse();
    expect(service.isSaving()).toBeFalse();
    expect(service.error()).toBeNull();
    expect(service.successMessage()).toBeNull();
  });

  it('should load courses and update courses signal', () => {
    const mockResponse: CoursesResponse = {
      status: 'ok',
      count: 1,
      data: [mockCourse],
    };

    service.loadCourses().subscribe((courses) => {
      expect(courses.length).toBe(1);
      expect(courses[0].title).toBe('Angular: De Cero a Experto');
    });

    expect(service.isLoading()).toBeTrue();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.isLoading()).toBeFalse();
    expect(service.courses().length).toBe(1);
    expect(service.courses()[0].id).toBe(1);
  });

  it('should create course and prepend it to courses signal', () => {
    const newCourseDto: CreateCourseDto = {
      title: 'NestJS + Microservicios',
      slug: 'nestjs-microservicios',
      description: 'Aprende a diseñar arquitecturas escalables con NestJS.',
      level: 'advanced',
      duration: '40 horas',
      url: 'https://cursos.devtalles.com/courses/nestjs',
      tags: ['NestJS', 'TypeScript'],
    };

    const createdCourse: Course = {
      ...newCourseDto,
      id: 2,
    };

    const mockResponse: SingleCourseResponse = {
      status: 'ok',
      message: 'Curso creado exitosamente.',
      data: createdCourse,
    };

    service.createCourse(newCourseDto).subscribe((course) => {
      expect(course.id).toBe(2);
      expect(course.title).toBe('NestJS + Microservicios');
    });

    expect(service.isSaving()).toBeTrue();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCourseDto);
    req.flush(mockResponse);

    expect(service.isSaving()).toBeFalse();
    expect(service.successMessage()).toBe('¡Curso creado exitosamente!');
    expect(service.courses().length).toBe(1);
    expect(service.courses()[0].title).toBe('NestJS + Microservicios');
  });

  it('should update course and update it in courses signal', () => {
    // Seed initial course
    service.courses.set([mockCourse]);

    const updateDto: UpdateCourseDto = {
      title: 'Angular 17+ Moderno',
      duration: '38 horas',
    };

    const updatedCourse: Course = {
      ...mockCourse,
      title: 'Angular 17+ Moderno',
      duration: '38 horas',
    };

    const mockResponse: SingleCourseResponse = {
      status: 'ok',
      message: 'Curso actualizado exitosamente.',
      data: updatedCourse,
    };

    service.updateCourse(1, updateDto).subscribe((course) => {
      expect(course.title).toBe('Angular 17+ Moderno');
      expect(course.duration).toBe('38 horas');
    });

    expect(service.isSaving()).toBeTrue();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);

    expect(service.isSaving()).toBeFalse();
    expect(service.successMessage()).toBe('¡Curso actualizado exitosamente!');
    expect(service.courses()[0].title).toBe('Angular 17+ Moderno');
  });

  it('should clear feedback messages', () => {
    service.error.set('Test error');
    service.successMessage.set('Test success');

    service.clearFeedback();

    expect(service.error()).toBeNull();
    expect(service.successMessage()).toBeNull();
  });
});

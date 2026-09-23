import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CoursesComponent } from './courses.component';
import { CoursesService } from './services/courses.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { Course } from './models/course.model';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let coursesService: CoursesService;

  const mockCourses: Course[] = [
    {
      id: 1,
      title: 'Angular Pro: De Cero a Experto',
      slug: 'angular-pro',
      description: 'Aprende Angular a fondo.',
      level: 'intermediate',
      duration: '30 horas',
      url: 'https://devtalles.com/courses/angular',
      tags: [{ id: 1, name: 'Angular' }, { id: 2, name: 'TypeScript' }],
    },
    {
      id: 2,
      title: 'Docker y Kubernetes Práctico',
      slug: 'docker-kubernetes',
      description: 'Contenedores y orquestación.',
      level: 'advanced',
      duration: '20 horas',
      url: 'https://devtalles.com/courses/docker',
      tags: [{ id: 3, name: 'Docker' }],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesComponent, HttpClientTestingModule],
      providers: [
        CoursesService,
        AuthService,
        provideRouter([]),
      ],
    }).compileComponents();

    coursesService = TestBed.inject(CoursesService);
    spyOn(coursesService, 'loadCourses').and.returnValue(of(mockCourses));

    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load courses on init', () => {
    expect(component).toBeTruthy();
    expect(coursesService.loadCourses).toHaveBeenCalled();
  });

  it('should filter courses by search query', () => {
    coursesService.courses.set(mockCourses);

    // Initial state has both
    expect(component.filteredCourses().length).toBe(2);

    // Search by title
    component.searchQuery.set('Angular');
    expect(component.filteredCourses().length).toBe(1);
    expect(component.filteredCourses()[0].title).toContain('Angular');

    // Search by tag
    component.searchQuery.set('Docker');
    expect(component.filteredCourses().length).toBe(1);
    expect(component.filteredCourses()[0].title).toContain('Docker');

    // Search with no results
    component.searchQuery.set('NonExistentTechnology');
    expect(component.filteredCourses().length).toBe(0);
  });

  it('should filter courses by level', () => {
    coursesService.courses.set(mockCourses);

    component.selectedLevel.set('intermediate');
    expect(component.filteredCourses().length).toBe(1);
    expect(component.filteredCourses()[0].level).toBe('intermediate');

    component.selectedLevel.set('advanced');
    expect(component.filteredCourses().length).toBe(1);
    expect(component.filteredCourses()[0].level).toBe('advanced');

    component.selectedLevel.set('beginner');
    expect(component.filteredCourses().length).toBe(0);
  });

  it('should open modal in create mode', () => {
    component.openCreateModal();
    expect(component.isModalOpen()).toBeTrue();
    expect(component.selectedCourse()).toBeNull();
  });

  it('should open modal in edit mode with selected course', () => {
    component.openEditModal(mockCourses[0]);
    expect(component.isModalOpen()).toBeTrue();
    expect(component.selectedCourse()).toEqual(mockCourses[0]);
  });

  it('should close modal when closeModal is called', () => {
    component.openCreateModal();
    expect(component.isModalOpen()).toBeTrue();

    component.closeModal();
    expect(component.isModalOpen()).toBeFalse();
    expect(component.selectedCourse()).toBeNull();
  });

  it('should delegate create to coursesService onFormSubmit', () => {
    spyOn(coursesService, 'createCourse').and.returnValue(of(mockCourses[0]));

    component.openCreateModal();
    component.onFormSubmit({
      mode: 'create',
      dto: {
        title: 'Nuevo Curso',
        description: 'Descripción adecuada del curso',
        level: 'beginner',
        duration: '10 horas',
        url: 'https://devtalles.com/courses/nuevo',
      },
    });

    expect(coursesService.createCourse).toHaveBeenCalled();
    expect(component.isModalOpen()).toBeFalse();
  });

  it('should delegate update to coursesService onFormSubmit', () => {
    spyOn(coursesService, 'updateCourse').and.returnValue(of(mockCourses[0]));

    component.openEditModal(mockCourses[0]);
    component.onFormSubmit({
      mode: 'edit',
      courseId: 1,
      dto: {
        title: 'Angular Actualizado',
      },
    });

    expect(coursesService.updateCourse).toHaveBeenCalledWith(1, { title: 'Angular Actualizado' });
    expect(component.isModalOpen()).toBeFalse();
  });
});

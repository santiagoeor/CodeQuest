import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { PathsComponent } from './paths.component';
import { PathsService } from './services/paths.service';
import { ProgressService } from '../progress/services/progress.service';
import { LearningPath } from './models/path.model';

describe('PathsComponent', () => {
  let component: PathsComponent;
  let fixture: ComponentFixture<PathsComponent>;
  let pathsService: PathsService;
  let progressService: ProgressService;

  const mockPath: LearningPath = {
    id: 1,
    user_id: 1,
    title: 'Ruta Fundacional: Frontend Web Moderno',
    description: 'Itinerario de cursos para nivel principiante.',
    level: 'beginner',
    status: 'active',
    created_at: '2026-09-22T00:00:00Z',
    updated_at: '2026-09-22T00:00:00Z',
    courses: [
      {
        id: 101,
        title: 'JavaScript Moderno',
        slug: 'javascript-moderno',
        description: 'Bases sólidas de JavaScript.',
        level: 'beginner',
        duration: '28 horas',
        url: 'https://cursos.devtalles.com/courses/javascript-moderno',
        image_url: 'https://devtalles.com/js.png',
        tags: ['JavaScript'],
        reason: 'Paso inicial para dominar las bases.',
      },
      {
        id: 102,
        title: 'TypeScript Guía Completa',
        slug: 'typescript-guia',
        description: 'Tipado estático y modular.',
        level: 'beginner',
        duration: '12 horas',
        url: 'https://cursos.devtalles.com/courses/typescript',
        image_url: 'https://devtalles.com/ts.png',
        tags: ['TypeScript'],
        reason: 'Consolidación de tipado.',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathsComponent, HttpClientTestingModule],
      providers: [PathsService, ProgressService, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PathsComponent);
    component = fixture.componentInstance;
    pathsService = TestBed.inject(PathsService);
    progressService = TestBed.inject(ProgressService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty state when user has no paths', () => {
    spyOn(pathsService, 'loadUserPaths').and.returnValue(of([]));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Aún no tienes rutas guardadas');
    expect(compiled.textContent).toContain('Comenzar Diagnóstico');
  });

  it('should render active roadmap when paths exist', () => {
    spyOn(pathsService, 'loadUserPaths').and.returnValue(of([mockPath]));
    pathsService.paths.set([mockPath]);
    pathsService.currentPath.set(mockPath);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ruta Fundacional: Frontend Web Moderno');
    expect(compiled.textContent).toContain('JavaScript Moderno');
    expect(compiled.textContent).toContain('TypeScript Guía Completa');
    expect(compiled.textContent).toContain('Ver en DevTalles');
  });

  it('should render reactive progress bar in active path header (AC-2)', () => {
    spyOn(pathsService, 'loadUserPaths').and.returnValue(of([mockPath]));
    pathsService.paths.set([mockPath]);
    pathsService.currentPath.set(mockPath);

    // Set 1 of 2 courses completed (50%)
    progressService.completedCourseIds.set(new Set([101]));
    progressService.metricsByPath.set(
      new Map([
        [
          1,
          {
            learning_path_id: 1,
            total_courses_count: 2,
            completed_courses_count: 1,
            progress_percentage: 50.0,
            completed_course_ids: [101],
          },
        ],
      ])
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Tu Progreso en esta Ruta');
    expect(compiled.textContent).toContain('1 de 2 cursos completados');
    expect(compiled.textContent).toContain('50%');
  });

  it('should display celebratory message when path is 100% completed (AC-4)', () => {
    spyOn(pathsService, 'loadUserPaths').and.returnValue(of([mockPath]));
    pathsService.paths.set([mockPath]);
    pathsService.currentPath.set(mockPath);

    // All courses completed
    progressService.completedCourseIds.set(new Set([101, 102]));
    progressService.metricsByPath.set(
      new Map([
        [
          1,
          {
            learning_path_id: 1,
            total_courses_count: 2,
            completed_courses_count: 2,
            progress_percentage: 100.0,
            completed_course_ids: [101, 102],
          },
        ],
      ])
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('¡Felicidades! Has completado el 100% de esta ruta');
    expect(compiled.textContent).toContain('Ruta 100% Completada');
    expect(compiled.textContent).toContain('Itinerario Completado');
  });

  it('should calculate total hours correctly', () => {
    const totalHours = component.getTotalHours(mockPath);
    expect(totalHours).toBe('40 horas estimadas');
  });
});

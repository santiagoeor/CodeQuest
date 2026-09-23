import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { PathsComponent } from './paths.component';
import { PathsService } from './services/paths.service';
import { LearningPath } from './models/path.model';

describe('PathsComponent', () => {
  let component: PathsComponent;
  let fixture: ComponentFixture<PathsComponent>;
  let pathsService: PathsService;

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
      providers: [PathsService, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PathsComponent);
    component = fixture.componentInstance;
    pathsService = TestBed.inject(PathsService);
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

  it('should calculate total hours correctly', () => {
    const totalHours = component.getTotalHours(mockPath);
    expect(totalHours).toBe('40 horas estimadas');
  });
});

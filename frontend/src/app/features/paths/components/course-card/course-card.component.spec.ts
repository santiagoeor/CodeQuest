import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CourseCardComponent } from './course-card.component';
import { ProgressService } from '../../../progress/services/progress.service';
import { PathCourse } from '../../models/path.model';

describe('CourseCardComponent', () => {
  let component: CourseCardComponent;
  let fixture: ComponentFixture<CourseCardComponent>;
  let progressService: ProgressService;

  const mockCourse: PathCourse = {
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCardComponent, HttpClientTestingModule],
      providers: [ProgressService],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCardComponent);
    component = fixture.componentInstance;
    progressService = TestBed.inject(ProgressService);

    fixture.componentRef.setInput('course', mockCourse);
    fixture.componentRef.setInput('step', 1);
    fixture.componentRef.setInput('learningPathId', 10);
    fixture.componentRef.setInput('allPathCourseIds', [101, 102]);
  });

  it('should render course details and pending completion button (AC-1)', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('JavaScript Moderno');
    expect(compiled.textContent).toContain('28 horas');
    expect(compiled.textContent).toContain('Principiante');
    expect(compiled.textContent).toContain('Marcar completado');
    expect(compiled.textContent).toContain('Ver en DevTalles');
  });

  it('should toggle course progress when clicking completion button (AC-1, AC-3)', () => {
    spyOn(progressService, 'toggleCourseProgress').and.returnValue(
      of({
        course_id: 101,
        is_completed: true,
        completed_at: '2026-09-22T21:00:00Z',
        learning_path_id: 10,
        total_courses_count: 2,
        completed_courses_count: 1,
        progress_percentage: 50.0,
        completed_course_ids: [101],
      })
    );

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button).toBeTruthy();
    button.click();

    expect(progressService.toggleCourseProgress).toHaveBeenCalledWith(101, 10, [101, 102]);
  });

  it('should render completed styling and badge when course is marked completed (AC-3)', () => {
    progressService.completedCourseIds.set(new Set([101]));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Completado');
    expect(component.isCompleted()).toBeTrue();
  });
});

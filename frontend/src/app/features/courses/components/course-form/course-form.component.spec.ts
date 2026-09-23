import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseFormComponent } from './course-form.component';
import { Course } from '../../models/course.model';

describe('CourseFormComponent', () => {
  let component: CourseFormComponent;
  let fixture: ComponentFixture<CourseFormComponent>;

  const mockCourse: Course = {
    id: 5,
    title: 'Docker y Kubernetes de Cero a Experto',
    slug: 'docker-kubernetes-cero-experto',
    description: 'Aprende contenedores, despliegues, redes y orquestación.',
    level: 'intermediate',
    duration: '22 horas',
    url: 'https://cursos.devtalles.com/courses/docker',
    image_url: 'https://devtalles.com/docker.png',
    tags: [{ id: 1, name: 'Docker' }, { id: 2, name: 'DevOps' }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with an invalid form initially (create mode)', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode()).toBeFalse();
    expect(component.form.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const titleCtrl = component.form.get('title');
    const urlCtrl = component.form.get('url');
    const descCtrl = component.form.get('description');
    const durationCtrl = component.form.get('duration');

    expect(titleCtrl?.valid).toBeFalse();
    expect(titleCtrl?.hasError('required')).toBeTrue();

    // Invalid url
    urlCtrl?.setValue('not-a-valid-url');
    expect(urlCtrl?.valid).toBeFalse();

    // Valid url
    urlCtrl?.setValue('https://devtalles.com/courses/angular');
    expect(urlCtrl?.valid).toBeTrue();

    // Short description
    descCtrl?.setValue('short');
    expect(descCtrl?.valid).toBeFalse();
    expect(descCtrl?.hasError('minlength')).toBeTrue();

    descCtrl?.setValue('Esta es una descripción pedagógica adecuada con suficiente longitud.');
    expect(descCtrl?.valid).toBeTrue();

    durationCtrl?.setValue('15 horas');
    expect(durationCtrl?.valid).toBeTrue();
  });

  it('should auto-generate slug from title in create mode', () => {
    component.form.get('title')?.setValue('Vue 3 Intermedio Avanzado');
    component.onTitleChange();

    expect(component.form.get('slug')?.value).toBe('vue-3-intermedio-avanzado');
  });

  it('should add custom tags and avoid duplicates', () => {
    const fakeInput = document.createElement('input');
    fakeInput.value = 'RxJS';

    component.addCustomTag(fakeInput);
    expect(component.tags()).toContain('RxJS');
    expect(fakeInput.value).toBe('');

    // Try adding duplicate with different casing
    fakeInput.value = 'rxjs';
    component.addCustomTag(fakeInput);
    expect(component.tags().length).toBe(1);
  });

  it('should add suggested tags and remove tags', () => {
    component.addSuggestedTag('NestJS');
    component.addSuggestedTag('Docker');

    expect(component.tags()).toContain('NestJS');
    expect(component.tags()).toContain('Docker');
    expect(component.tags().length).toBe(2);

    component.removeTag('NestJS');
    expect(component.tags()).not.toContain('NestJS');
    expect(component.tags()).toContain('Docker');
  });

  it('should populate form in edit mode when course input is provided', () => {
    component.course = mockCourse;
    component.ngOnChanges({
      course: {
        currentValue: mockCourse,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.isEditMode()).toBeTrue();
    expect(component.form.get('title')?.value).toBe(mockCourse.title);
    expect(component.form.get('level')?.value).toBe('intermediate');
    expect(component.tags()).toEqual(['Docker', 'DevOps']);
    expect(component.form.valid).toBeTrue();
  });

  it('should emit formSubmit in create mode when form is valid', () => {
    spyOn(component.formSubmit, 'emit');

    component.form.patchValue({
      title: 'Go: Bases y Concurrencia',
      slug: 'go-bases-concurrencia',
      description: 'Curso completo para dominar Go y concurrencia.',
      level: 'intermediate',
      duration: '18 horas',
      url: 'https://devtalles.com/courses/go',
    });
    component.addSuggestedTag('Git');

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      mode: 'create',
      dto: {
        title: 'Go: Bases y Concurrencia',
        slug: 'go-bases-concurrencia',
        description: 'Curso completo para dominar Go y concurrencia.',
        level: 'intermediate',
        duration: '18 horas',
        url: 'https://devtalles.com/courses/go',
        image_url: null,
        tags: ['Git'],
      },
    });
  });

  it('should emit formSubmit in edit mode with courseId', () => {
    spyOn(component.formSubmit, 'emit');

    component.course = mockCourse;
    component.ngOnChanges({
      course: {
        currentValue: mockCourse,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    component.form.patchValue({
      title: 'Docker y Kubernetes 2026',
    });

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      mode: 'edit',
      courseId: 5,
      dto: jasmine.objectContaining({
        title: 'Docker y Kubernetes 2026',
        level: 'intermediate',
      }),
    });
  });

  it('should emit formCancel when cancel is clicked', () => {
    spyOn(component.formCancel, 'emit');
    component.onCancel();
    expect(component.formCancel.emit).toHaveBeenCalled();
  });
});

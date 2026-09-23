import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AssessmentComponent } from './assessment.component';
import { AssessmentService } from './services/assessment.service';
import { Question, LearningPathRecommendation } from './models/assessment.model';

describe('AssessmentComponent', () => {
  let component: AssessmentComponent;
  let fixture: ComponentFixture<AssessmentComponent>;
  let assessmentService: AssessmentService;

  const mockQuestions: Question[] = [
    {
      id: 1,
      text: '¿Cuál es tu nivel de experiencia en programación?',
      category: 'skill_level',
      type: 'single_choice',
      order: 1,
      options: [
        { id: 101, question_id: 1, text: 'Principiante', value: 'beginner', order: 1 },
        { id: 102, question_id: 1, text: 'Intermedio', value: 'intermediate', order: 2 },
      ],
    },
    {
      id: 2,
      text: '¿Qué áreas del desarrollo te interesan más?',
      category: 'interest_area',
      type: 'multiple_choice',
      order: 2,
      options: [
        { id: 201, question_id: 2, text: 'Frontend Web', value: 'frontend', order: 1 },
        { id: 202, question_id: 2, text: 'Backend & APIs', value: 'backend', order: 2 },
      ],
    },
  ];

  const mockRecommendation: LearningPathRecommendation = {
    title: 'Ruta Fundacional: Frontend Web Moderno',
    description: 'Itinerario de cursos para nivel principiante.',
    level: 'beginner',
    estimated_duration: '35 horas',
    total_courses: 1,
    target_areas: ['Frontend Web Moderno'],
    courses: [
      {
        step: 1,
        id: 1,
        title: 'JavaScript Moderno',
        slug: 'javascript-moderno',
        description: 'Bases sólidas de JavaScript.',
        level: 'beginner',
        duration: '28 horas',
        url: 'https://cursos.devtalles.com/courses/javascript-moderno',
        tags: ['JavaScript'],
        reason: 'Paso inicial para dominar las bases.',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentComponent],
      providers: [
        provideRouter([]),
        {
          provide: AssessmentService,
          useValue: {
            questions: jasmine.createSpy('questions').and.returnValue([]),
            currentStep: jasmine.createSpy('currentStep').and.returnValue(0),
            answers: jasmine.createSpy('answers').and.returnValue(new Map()),
            recommendation: jasmine.createSpy('recommendation').and.returnValue(null),
            isLoading: jasmine.createSpy('isLoading').and.returnValue(false),
            isSubmitting: jasmine.createSpy('isSubmitting').and.returnValue(false),
            error: jasmine.createSpy('error').and.returnValue(null),
            currentQuestion: jasmine.createSpy('currentQuestion').and.returnValue(mockQuestions[0]),
            totalSteps: jasmine.createSpy('totalSteps').and.returnValue(2),
            progressPercentage: jasmine.createSpy('progressPercentage').and.returnValue(50),
            isFirstStep: jasmine.createSpy('isFirstStep').and.returnValue(true),
            isLastStep: jasmine.createSpy('isLastStep').and.returnValue(false),
            isCurrentStepValid: jasmine.createSpy('isCurrentStepValid').and.returnValue(false),
            loadQuestions: jasmine.createSpy('loadQuestions').and.returnValue(of(mockQuestions)),
            toggleOption: jasmine.createSpy('toggleOption'),
            isOptionSelected: jasmine.createSpy('isOptionSelected').and.returnValue(false),
            nextStep: jasmine.createSpy('nextStep'),
            previousStep: jasmine.createSpy('previousStep'),
            generateRecommendation: jasmine.createSpy('generateRecommendation').and.returnValue(of(mockRecommendation)),
            reset: jasmine.createSpy('reset'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentComponent);
    component = fixture.componentInstance;
    assessmentService = TestBed.inject(AssessmentService);
    fixture.detectChanges();
  });

  it('should create component and call loadQuestions if list is empty (AC-1)', () => {
    expect(component).toBeTruthy();
    expect(assessmentService.loadQuestions).toHaveBeenCalled();
  });

  it('should render the question title and category correctly (AC-1)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('¿Cuál es tu nivel de experiencia en programación?');
    expect(compiled.textContent).toContain('Nivel y Experiencia');
  });

  it('should render progress bar indicator at 50% for step 1 of 2 (AC-3)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Paso 1 de 2');
    expect(compiled.textContent).toContain('50%');
  });

  it('should disable Next button when step is not valid (AC-2)', () => {
    const nextBtn = fixture.nativeElement.querySelector('button.btn-primary') as HTMLButtonElement;
    expect(nextBtn).toBeTruthy();
    expect(nextBtn.disabled).toBeTrue();
  });

  it('should toggle option when clicking an option button (AC-2)', () => {
    const optionBtns = fixture.nativeElement.querySelectorAll('button[type="button"]') as NodeListOf<HTMLButtonElement>;
    // First option button is "Principiante"
    const firstOption = Array.from(optionBtns).find((btn) => btn.textContent?.includes('Principiante'));
    expect(firstOption).toBeTruthy();

    firstOption?.click();
    expect(assessmentService.toggleOption).toHaveBeenCalledWith(1, 101, false);
  });

  it('should call nextStep when clicking Siguiente button if valid (AC-2)', () => {
    (assessmentService.isCurrentStepValid as jasmine.Spy).and.returnValue(true);
    fixture.detectChanges();

    const nextBtn = fixture.nativeElement.querySelector('button.btn-primary') as HTMLButtonElement;
    expect(nextBtn.disabled).toBeFalse();
    nextBtn.click();

    expect(assessmentService.nextStep).toHaveBeenCalled();
  });

  it('should call generateRecommendation when submitting on last step (AC-4)', () => {
    (assessmentService.isLastStep as jasmine.Spy).and.returnValue(true);
    (assessmentService.isCurrentStepValid as jasmine.Spy).and.returnValue(true);
    (assessmentService.currentQuestion as jasmine.Spy).and.returnValue(mockQuestions[1]);
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('button.btn-primary') as HTMLButtonElement;
    expect(submitBtn.textContent).toContain('Generar mi Ruta');
    submitBtn.click();

    expect(assessmentService.generateRecommendation).toHaveBeenCalled();
  });

  it('should render recommendation view when recommendation exists (AC-4)', () => {
    (assessmentService.recommendation as jasmine.Spy).and.returnValue(mockRecommendation);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ruta Fundacional: Frontend Web Moderno');
    expect(compiled.textContent).toContain('JavaScript Moderno');
    expect(compiled.textContent).toContain('¿Por qué este curso?');
    expect(compiled.textContent).toContain('Ver en DevTalles');
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AssessmentService } from './assessment.service';
import { environment } from '../../../../environments/environment';
import {
  AssessmentQuestionsResponse,
  Question,
  RecommendationResponse,
} from '../models/assessment.model';

describe('AssessmentService', () => {
  let service: AssessmentService;
  let httpMock: HttpTestingController;

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
      text: '¿Qué áreas te interesan más?',
      category: 'interest_area',
      type: 'multiple_choice',
      order: 2,
      options: [
        { id: 201, question_id: 2, text: 'Frontend Web', value: 'frontend', order: 1 },
        { id: 202, question_id: 2, text: 'Backend & APIs', value: 'backend', order: 2 },
      ],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AssessmentService],
    });

    service = TestBed.inject(AssessmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created and have initial default values', () => {
    expect(service).toBeTruthy();
    expect(service.questions().length).toBe(0);
    expect(service.currentStep()).toBe(0);
    expect(service.isCurrentStepValid()).toBeFalse();
    expect(service.recommendation()).toBeNull();
  });

  it('should fetch questions from API and update signals (AC-1)', () => {
    const mockResponse: AssessmentQuestionsResponse = {
      status: 'ok',
      count: 2,
      data: mockQuestions,
    };

    service.loadQuestions().subscribe((questions) => {
      expect(questions.length).toBe(2);
      expect(service.questions().length).toBe(2);
      expect(service.totalSteps()).toBe(2);
      expect(service.currentQuestion()?.id).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/assessment/questions`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle single_choice option toggle properly', () => {
    service.questions.set(mockQuestions);

    service.toggleOption(1, 101, false);
    expect(service.isOptionSelected(1, 101)).toBeTrue();
    expect(service.isOptionSelected(1, 102)).toBeFalse();
    expect(service.isCurrentStepValid()).toBeTrue();

    // Selecting another option replaces the previous one
    service.toggleOption(1, 102, false);
    expect(service.isOptionSelected(1, 101)).toBeFalse();
    expect(service.isOptionSelected(1, 102)).toBeTrue();
  });

  it('should handle multiple_choice option toggle properly', () => {
    service.questions.set(mockQuestions);
    service.goToStep(1); // question 2 is multiple_choice

    service.toggleOption(2, 201, true);
    expect(service.isOptionSelected(2, 201)).toBeTrue();
    expect(service.isCurrentStepValid()).toBeTrue();

    // Adding second option
    service.toggleOption(2, 202, true);
    expect(service.isOptionSelected(2, 201)).toBeTrue();
    expect(service.isOptionSelected(2, 202)).toBeTrue();

    // Untoggling first option
    service.toggleOption(2, 201, true);
    expect(service.isOptionSelected(2, 201)).toBeFalse();
    expect(service.isOptionSelected(2, 202)).toBeTrue();
  });

  it('should enforce step validation and navigation controls (AC-2 & AC-3)', () => {
    service.questions.set(mockQuestions);

    // Initial state: not valid, cannot advance
    expect(service.isCurrentStepValid()).toBeFalse();
    expect(service.nextStep()).toBeFalse();
    expect(service.currentStep()).toBe(0);

    // Answer step 1
    service.toggleOption(1, 101, false);
    expect(service.isCurrentStepValid()).toBeTrue();
    expect(service.progressPercentage()).toBe(50); // step 1 of 2

    // Advance to step 2
    expect(service.nextStep()).toBeTrue();
    expect(service.currentStep()).toBe(1);
    expect(service.isLastStep()).toBeTrue();
    expect(service.progressPercentage()).toBe(100);

    // Go back
    expect(service.previousStep()).toBeTrue();
    expect(service.currentStep()).toBe(0);
  });

  it('should post selected options to /api/recommendations/generate (AC-4)', () => {
    service.questions.set(mockQuestions);
    service.toggleOption(1, 101, false);
    service.toggleOption(2, 201, true);

    const mockRecResponse: RecommendationResponse = {
      status: 'ok',
      data: {
        title: 'Ruta Fundacional: Frontend Web Moderno',
        description: 'Itinerario de 3 cursos curados para nivel Principiante.',
        level: 'beginner',
        estimated_duration: '45 horas',
        total_courses: 1,
        target_areas: ['Frontend Web Moderno'],
        courses: [
          {
            step: 1,
            id: 10,
            title: 'JavaScript Moderno: Guía para dominar el lenguaje',
            slug: 'javascript-moderno',
            description: 'Curso completo de JavaScript.',
            level: 'beginner',
            duration: '28 horas',
            url: 'https://cursos.devtalles.com/courses/javascript-moderno',
            tags: ['JavaScript', 'Frontend'],
            reason: 'Paso inicial fundamental.',
          },
        ],
      },
    };

    service.generateRecommendation().subscribe((rec) => {
      expect(rec.title).toBe('Ruta Fundacional: Frontend Web Moderno');
      expect(rec.courses.length).toBe(1);
      expect(service.recommendation()).toEqual(mockRecResponse.data);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/recommendations/generate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ options: [101, 201] });
    req.flush(mockRecResponse);
  });

  it('should reset wizard state when reset() is called', () => {
    service.questions.set(mockQuestions);
    service.toggleOption(1, 101, false);
    service.currentStep.set(1);

    service.reset();
    expect(service.currentStep()).toBe(0);
    expect(service.answers().size).toBe(0);
    expect(service.recommendation()).toBeNull();
  });
});

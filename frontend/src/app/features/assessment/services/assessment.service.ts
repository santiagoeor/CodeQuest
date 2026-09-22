import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AssessmentQuestionsResponse,
  GenerateRecommendationPayload,
  LearningPathRecommendation,
  Question,
  RecommendationResponse,
} from '../models/assessment.model';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Reactive state signals
  readonly questions = signal<Question[]>([]);
  readonly currentStep = signal<number>(0);
  readonly answers = signal<Map<number, number[]>>(new Map());
  readonly recommendation = signal<LearningPathRecommendation | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Computed signals
  readonly currentQuestion = computed(() => {
    const list = this.questions();
    const index = this.currentStep();
    return list[index] ?? null;
  });

  readonly totalSteps = computed(() => this.questions().length);

  readonly progressPercentage = computed(() => {
    const total = this.totalSteps();
    if (total === 0) return 0;
    // Step index is 0-based; on step 0 progress starts at round((1/total)*100) or currentStep/total
    return Math.round(((this.currentStep() + 1) / total) * 100);
  });

  readonly isFirstStep = computed(() => this.currentStep() === 0);

  readonly isLastStep = computed(() => {
    const total = this.totalSteps();
    return total > 0 && this.currentStep() === total - 1;
  });

  readonly isCurrentStepValid = computed(() => {
    const question = this.currentQuestion();
    if (!question) return false;
    const selected = this.answers().get(question.id);
    return Array.isArray(selected) && selected.length > 0;
  });

  /**
   * Fetch all assessment questions from backend API (AC-1).
   */
  loadQuestions(): Observable<Question[]> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http
      .get<AssessmentQuestionsResponse>(`${this.apiUrl}/assessment/questions`)
      .pipe(
        map((res) => res.data || []),
        tap((data) => {
          this.questions.set(data);
          this.isLoading.set(false);
        }),
        catchError((err) => {
          this.isLoading.set(false);
          const msg =
            err.error?.message ||
            'Error al cargar las preguntas del diagnóstico. Por favor intenta nuevamente.';
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }

  /**
   * Select or toggle an option for a question.
   */
  toggleOption(questionId: number, optionId: number, isMultiple: boolean): void {
    const currentMap = new Map(this.answers());
    const existing = currentMap.get(questionId) || [];

    if (isMultiple) {
      if (existing.includes(optionId)) {
        currentMap.set(
          questionId,
          existing.filter((id) => id !== optionId)
        );
      } else {
        currentMap.set(questionId, [...existing, optionId]);
      }
    } else {
      currentMap.set(questionId, [optionId]);
    }

    this.answers.set(currentMap);
  }

  /**
   * Check if a specific option is currently selected.
   */
  isOptionSelected(questionId: number, optionId: number): boolean {
    const selected = this.answers().get(questionId);
    return Array.isArray(selected) && selected.includes(optionId);
  }

  /**
   * Advance to the next step if current step has at least one answer (AC-2).
   */
  nextStep(): boolean {
    if (!this.isCurrentStepValid()) {
      return false;
    }
    if (this.currentStep() < this.totalSteps() - 1) {
      this.currentStep.update((prev) => prev + 1);
      return true;
    }
    return false;
  }

  /**
   * Go back to the previous step.
   */
  previousStep(): boolean {
    if (this.currentStep() > 0) {
      this.currentStep.update((prev) => prev - 1);
      return true;
    }
    return false;
  }

  /**
   * Jump to a specific step if valid.
   */
  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.totalSteps()) {
      this.currentStep.set(stepIndex);
    }
  }

  /**
   * Collect all selected option IDs.
   */
  getAllSelectedOptionIds(): number[] {
    const optionIds: number[] = [];
    for (const ids of this.answers().values()) {
      optionIds.push(...ids);
    }
    return optionIds;
  }

  /**
   * Submit questionnaire answers to /api/recommendations/generate (AC-4).
   */
  generateRecommendation(): Observable<LearningPathRecommendation> {
    const optionIds = this.getAllSelectedOptionIds();
    const payload: GenerateRecommendationPayload = {
      options: optionIds,
    };

    this.isSubmitting.set(true);
    this.error.set(null);

    return this.http
      .post<RecommendationResponse>(
        `${this.apiUrl}/recommendations/generate`,
        payload
      )
      .pipe(
        map((res) => res.data),
        tap((rec) => {
          this.recommendation.set(rec);
          this.isSubmitting.set(false);
        }),
        catchError((err) => {
          this.isSubmitting.set(false);
          const msg =
            err.error?.message ||
            'Error al generar la ruta de recomendación. Por favor intenta de nuevo.';
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }

  /**
   * Reset assessment state for a fresh questionnaire attempt.
   */
  reset(): void {
    this.currentStep.set(0);
    this.answers.set(new Map());
    this.recommendation.set(null);
    this.error.set(null);
  }
}

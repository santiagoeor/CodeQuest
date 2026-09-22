import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { AssessmentService } from './services/assessment.service';
import { QuestionOption } from './models/assessment.model';

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [CommonModule, RouterLink, ContainerComponent],
  template: `
    <div class="py-8 sm:py-12 min-h-[calc(100vh-4rem)]">
      <app-container>

        <!-- STATE A: RESULTS / GENERATED LEARNING PATH -->
        @if (service.recommendation(); as rec) {
          <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <!-- Header Card -->
            <div class="card relative overflow-hidden bg-gradient-to-br from-cq-surface to-cq-surface-hover border-cq-primary/30 p-6 sm:p-8">
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="text-xs font-semibold px-3 py-1 rounded-full bg-cq-accent/15 text-cq-accent border border-cq-accent/30 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Diagnóstico completado
                </span>
                <span class="text-xs font-medium px-3 py-1 rounded-full bg-cq-surface text-cq-muted border border-cq-border">
                  Nivel: <strong class="text-cq-text capitalize">{{ rec.level }}</strong>
                </span>
                <span class="text-xs font-medium px-3 py-1 rounded-full bg-cq-surface text-cq-muted border border-cq-border">
                  Duración estimada: <strong class="text-cq-text">{{ rec.estimated_duration }}</strong>
                </span>
                <span class="text-xs font-medium px-3 py-1 rounded-full bg-cq-surface text-cq-muted border border-cq-border">
                  {{ rec.total_courses }} {{ rec.total_courses === 1 ? 'curso' : 'cursos' }}
                </span>
              </div>

              <h1 class="text-2xl sm:text-3xl font-extrabold text-cq-text mb-3 leading-snug">
                {{ rec.title }}
              </h1>
              <p class="text-cq-muted text-sm sm:text-base leading-relaxed mb-6">
                {{ rec.description }}
              </p>

              <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-cq-border/60">
                <button (click)="restartAssessment()" class="btn-outline text-xs sm:text-sm py-2 px-4">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Repetir Diagnóstico
                </button>
                <a routerLink="/" class="text-xs sm:text-sm text-cq-muted hover:text-cq-text transition-colors ml-auto">
                  Volver al inicio
                </a>
              </div>
            </div>

            <!-- Recommended Courses List -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg sm:text-xl font-bold text-cq-text flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-cq-primary"></span>
                  Secuencia Pedagógica Recomendada
                </h2>
                <span class="text-xs text-cq-muted">Paso a paso ordenado por fundamentos</span>
              </div>

              <div class="space-y-4">
                @for (course of rec.courses; track course.id) {
                  <div class="card p-5 sm:p-6 transition-all duration-200 hover:border-cq-primary/50 relative">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      
                      <!-- Course Details -->
                      <div class="space-y-2.5 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="w-7 h-7 rounded-lg bg-cq-primary/20 text-cq-primary font-bold text-xs flex items-center justify-center border border-cq-primary/40">
                            #{{ course.step }}
                          </span>
                          <span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-cq-surface-hover text-cq-muted border border-cq-border capitalize">
                            {{ course.level }}
                          </span>
                          <span class="text-xs text-cq-muted flex items-center gap-1">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ course.duration }}
                          </span>
                        </div>

                        <h3 class="text-base sm:text-lg font-bold text-cq-text">
                          {{ course.title }}
                        </h3>

                        <p class="text-sm text-cq-muted leading-relaxed">
                          {{ course.description }}
                        </p>

                        <!-- Pedagogical reason -->
                        @if (course.reason) {
                          <div class="bg-cq-surface-hover/80 rounded-lg p-3 border-l-4 border-cq-accent text-xs sm:text-sm text-cq-text/90">
                            <span class="font-semibold text-cq-accent">¿Por qué este curso?:</span>
                            {{ course.reason }}
                          </div>
                        }

                        <!-- Tags -->
                        <div class="flex flex-wrap gap-1.5 pt-1">
                          @for (tag of course.tags; track tag) {
                            <span class="text-xs px-2 py-0.5 rounded bg-cq-surface-hover text-cq-muted border border-cq-border/60">
                              {{ tag }}
                            </span>
                          }
                        </div>
                      </div>

                      <!-- External Action -->
                      <div class="sm:self-center">
                        <a
                          [href]="course.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="btn-primary text-xs sm:text-sm w-full sm:w-auto justify-center whitespace-nowrap"
                        >
                          Ver en DevTalles
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        } @else {

          <!-- STATE B: LOADING -->
          @if (service.isLoading()) {
            <div class="max-w-2xl mx-auto py-20 text-center">
              <div class="inline-block w-12 h-12 border-4 border-cq-primary/30 border-t-cq-primary rounded-full animate-spin mb-4"></div>
              <h2 class="text-xl font-bold text-cq-text mb-2">Preparando tu diagnóstico...</h2>
              <p class="text-cq-muted text-sm">Cargando las preguntas del catálogo oficial de DevTalles</p>
            </div>
          } @else if (service.error()) {
            <!-- STATE C: ERROR -->
            <div class="max-w-lg mx-auto py-16 text-center">
              <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-cq-danger/15 flex items-center justify-center text-cq-danger">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-cq-text mb-2">Hubo un inconveniente</h2>
              <p class="text-cq-muted text-sm mb-6">{{ service.error() }}</p>
              <button (click)="retryLoad()" class="btn-primary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Reintentar
              </button>
            </div>
          } @else {

            <!-- STATE D: WIZARD QUESTIONS (AC-1, AC-2, AC-3, AC-4) -->
            @if (service.currentQuestion(); as question) {
              <div class="max-w-2xl mx-auto space-y-6">

                <!-- Progress Header (AC-3) -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="font-semibold text-cq-primary uppercase tracking-wider text-xs">
                      {{ formatCategory(question.category) }}
                    </span>
                    <div class="flex items-center gap-2">
                      <span class="text-cq-muted">
                        Paso {{ service.currentStep() + 1 }} de {{ service.totalSteps() }}
                      </span>
                      <span class="font-bold text-cq-text px-2 py-0.5 rounded bg-cq-surface border border-cq-border text-xs">
                        {{ service.progressPercentage() }}%
                      </span>
                    </div>
                  </div>

                  <!-- Progress bar track -->
                  <div class="w-full h-2.5 bg-cq-surface rounded-full overflow-hidden border border-cq-border/80">
                    <div
                      class="h-full bg-gradient-to-r from-cq-primary to-cq-accent transition-all duration-300 ease-out rounded-full"
                      [style.width.%]="service.progressPercentage()"
                    ></div>
                  </div>
                </div>

                <!-- Question Card (AC-1) -->
                <div class="card p-6 sm:p-8 space-y-6 shadow-xl border-cq-border">
                  <div>
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-xs font-medium px-2.5 py-0.5 rounded-full"
                            [ngClass]="question.type === 'multiple_choice' ? 'bg-cq-accent/15 text-cq-accent border border-cq-accent/30' : 'bg-cq-primary/15 text-cq-primary border border-cq-primary/30'">
                        {{ question.type === 'multiple_choice' ? 'Selección múltiple (puedes elegir varias)' : 'Selección única' }}
                      </span>
                    </div>
                    <h1 class="text-xl sm:text-2xl font-extrabold text-cq-text leading-tight">
                      {{ question.text }}
                    </h1>
                  </div>

                  <!-- Options Grid (AC-1 & AC-2) -->
                  <div class="space-y-3">
                    @for (option of question.options; track option.id) {
                      <button
                        type="button"
                        (click)="onSelectOption(option)"
                        class="w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 group"
                        [ngClass]="isSelected(option)
                          ? 'bg-cq-primary/15 border-cq-primary text-cq-text ring-1 ring-cq-primary'
                          : 'bg-cq-surface hover:bg-cq-surface-hover border-cq-border text-cq-muted hover:text-cq-text'"
                      >
                        <span class="font-medium text-sm sm:text-base leading-snug">
                          {{ option.text }}
                        </span>

                        <!-- Indicator Check / Radio -->
                        <div
                          class="w-5 h-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0"
                          [ngClass]="isSelected(option)
                            ? 'bg-cq-primary text-white'
                            : 'border border-cq-border group-hover:border-cq-muted'"
                        >
                          @if (isSelected(option)) {
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                            </svg>
                          }
                        </div>
                      </button>
                    }
                  </div>

                  <!-- Inline validation hint (AC-2) -->
                  @if (!service.isCurrentStepValid()) {
                    <p class="text-xs text-cq-warning flex items-center gap-1.5">
                      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Selecciona al menos una opción para continuar
                    </p>
                  }

                  <!-- Submission error if any -->
                  @if (service.error()) {
                    <div class="p-3 rounded-lg bg-cq-danger/15 border border-cq-danger/30 text-xs text-cq-danger">
                      {{ service.error() }}
                    </div>
                  }

                  <!-- Wizard Navigation Controls (AC-2 & AC-4) -->
                  <div class="flex items-center justify-between pt-4 border-t border-cq-border">
                    <button
                      type="button"
                      (click)="onPrevious()"
                      [disabled]="service.isFirstStep() || service.isSubmitting()"
                      class="btn-outline text-xs sm:text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                      Anterior
                    </button>

                    @if (!service.isLastStep()) {
                      <button
                        type="button"
                        (click)="onNext()"
                        [disabled]="!service.isCurrentStepValid() || service.isSubmitting()"
                        class="btn-primary text-xs sm:text-sm py-2 px-5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Siguiente
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    } @else {
                      <button
                        type="button"
                        (click)="onSubmit()"
                        [disabled]="!service.isCurrentStepValid() || service.isSubmitting()"
                        class="btn-primary text-xs sm:text-sm py-2 px-5 bg-gradient-to-r from-cq-primary to-cq-accent hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        @if (service.isSubmitting()) {
                          <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Generando ruta...
                        } @else {
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                          Generar mi Ruta
                        }
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
          }
        }
      </app-container>
    </div>
  `,
})
export class AssessmentComponent implements OnInit {
  readonly service = inject(AssessmentService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.service.questions().length === 0) {
      this.service.loadQuestions().subscribe({
        error: (err) => console.error('Error fetching questions', err),
      });
    }
  }

  retryLoad(): void {
    this.service.loadQuestions().subscribe();
  }

  formatCategory(category: string): string {
    const map: Record<string, string> = {
      skill_level: 'Nivel y Experiencia',
      interest_area: 'Áreas de Interés',
      experience: 'Tecnologías Previas',
      goal: 'Meta Profesional',
      time_dedication: 'Disponibilidad de Tiempo',
    };
    return map[category] || category.replace('_', ' ');
  }

  isSelected(option: QuestionOption): boolean {
    const currentQ = this.service.currentQuestion();
    if (!currentQ) return false;
    return this.service.isOptionSelected(currentQ.id, option.id);
  }

  onSelectOption(option: QuestionOption): void {
    const currentQ = this.service.currentQuestion();
    if (!currentQ) return;
    const isMultiple = currentQ.type === 'multiple_choice';
    this.service.toggleOption(currentQ.id, option.id, isMultiple);
  }

  onNext(): void {
    this.service.nextStep();
  }

  onPrevious(): void {
    this.service.previousStep();
  }

  onSubmit(): void {
    if (!this.service.isCurrentStepValid()) return;
    this.service.generateRecommendation().subscribe({
      error: (err) => console.error('Error submitting assessment', err),
    });
  }

  restartAssessment(): void {
    this.service.reset();
  }
}

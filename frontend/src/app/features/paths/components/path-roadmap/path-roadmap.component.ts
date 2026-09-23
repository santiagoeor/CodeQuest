import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathCourse } from '../../models/path.model';
import { CourseCardComponent } from '../course-card/course-card.component';
import { ProgressService } from '../../../progress/services/progress.service';

@Component({
  selector: 'app-path-roadmap',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  template: `
    <div class="relative py-4">

      <!-- Starting Flag / Milestone -->
      <div class="flex items-center gap-3 mb-6 ml-2 sm:ml-4">
        <div class="w-10 h-10 rounded-full bg-cq-primary/20 border-2 border-cq-primary flex items-center justify-center text-cq-primary shadow-lg shadow-cq-primary/20">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div>
          <span class="text-xs uppercase tracking-wider font-bold text-cq-primary">Punto de Partida</span>
          <p class="text-xs text-cq-muted">Fundamentos y primeros pasos de tu itinerario</p>
        </div>
      </div>

      <!-- Roadmap Timeline Sequence -->
      <div class="space-y-6 relative">
        @for (course of courses(); track course.id; let idx = $index; let isLast = $last) {
          <div class="flex items-start gap-3 sm:gap-6 relative group">
            
            <!-- Timeline Node Indicator & Connector Line -->
            <div class="flex flex-col items-center self-stretch shrink-0 ml-2 sm:ml-4">
              
              <!-- Node Badge Circle (Adaptive checkmark on completed AC-1, AC-3) -->
              <div
                class="w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-sm z-10 transition-all duration-300 group-hover:scale-110 shadow-md"
                [ngClass]="isCompleted(course)
                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/30'
                  : {
                      'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-emerald-500/20': course.level === 'beginner',
                      'bg-sky-500/20 border-sky-400 text-sky-400 shadow-sky-500/20': course.level === 'intermediate',
                      'bg-purple-500/20 border-purple-400 text-purple-400 shadow-purple-500/20': course.level === 'advanced'
                    }"
              >
                @if (isCompleted(course)) {
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                } @else {
                  {{ idx + 1 }}
                }
              </div>

              <!-- Connecting Line between nodes -->
              @if (!isLast) {
                <div
                  class="w-0.5 grow my-1 rounded-full transition-colors duration-300"
                  [ngClass]="isCompleted(course)
                    ? 'bg-gradient-to-b from-emerald-500 via-emerald-500/60 to-cq-border'
                    : 'bg-gradient-to-b from-cq-border via-cq-primary/50 to-cq-border'"
                ></div>
              }
            </div>

            <!-- Course Card Content -->
            <div class="flex-1 min-w-0 pb-2">
              <app-course-card
                [course]="course"
                [step]="idx + 1"
                [learningPathId]="learningPathId()"
                [allPathCourseIds]="courseIds()"
              />
            </div>
          </div>
        }
      </div>

      <!-- Destination Milestone (Finish line) -->
      @if (courses().length > 0) {
        <div class="flex items-center gap-3 mt-6 ml-2 sm:ml-4">
          <div
            class="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg transition-all duration-300"
            [ngClass]="isAllCompleted()
              ? 'bg-emerald-500 border-emerald-300 text-white shadow-emerald-500/40 ring-4 ring-emerald-500/20'
              : 'bg-cq-accent/20 border-cq-accent text-cq-accent shadow-cq-accent/20'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <span
              class="text-xs uppercase tracking-wider font-bold"
              [ngClass]="isAllCompleted() ? 'text-emerald-400' : 'text-cq-accent'"
            >
              {{ isAllCompleted() ? '¡Meta Completada al 100%!' : 'Meta del Itinerario' }}
            </span>
            <p class="text-xs text-cq-muted">Dominio integral y preparación profesional</p>
          </div>
        </div>
      }
    </div>
  `,
})
export class PathRoadmapComponent {
  private readonly progressService = inject(ProgressService);

  courses = input.required<PathCourse[]>();
  learningPathId = input<number | undefined>(undefined);

  readonly courseIds = computed(() => this.courses().map((c) => c.id));

  isCompleted(course: PathCourse): boolean {
    return (
      this.progressService.isCourseCompleted(course.id) ||
      course.pivot?.status === 'completed'
    );
  }

  readonly isAllCompleted = computed(() => {
    const list = this.courses();
    if (list.length === 0) return false;
    return list.every((c) => this.isCompleted(c));
  });
}

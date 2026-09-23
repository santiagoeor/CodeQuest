import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathCourse } from '../../models/path.model';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="card p-5 sm:p-6 transition-all duration-300 hover:border-cq-primary/60 hover:shadow-lg hover:shadow-cq-primary/5 relative group bg-cq-surface/80 backdrop-blur-sm"
      [class.border-l-4]="true"
      [class.border-l-emerald-500]="course().level === 'beginner'"
      [class.border-l-sky-500]="course().level === 'intermediate'"
      [class.border-l-purple-500]="course().level === 'advanced'"
    >
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        
        <!-- Left: Course Details -->
        <div class="space-y-3 flex-1 min-w-0">
          
          <!-- Badges Bar -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Step Badge -->
            <span
              class="w-7 h-7 rounded-lg bg-cq-primary/15 text-cq-primary font-extrabold text-xs flex items-center justify-center border border-cq-primary/30"
              title="Paso en el itinerario"
            >
              #{{ step() }}
            </span>

            <!-- Level Badge -->
            <span
              class="text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize"
              [ngClass]="{
                'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30': course().level === 'beginner',
                'bg-sky-500/15 text-sky-400 border border-sky-500/30': course().level === 'intermediate',
                'bg-purple-500/15 text-purple-400 border border-purple-500/30': course().level === 'advanced'
              }"
            >
              {{ getLevelLabel(course().level) }}
            </span>

            <!-- Duration Badge -->
            <span class="text-xs text-cq-muted flex items-center gap-1 bg-cq-surface-hover/80 px-2 py-0.5 rounded border border-cq-border/40">
              <svg class="w-3.5 h-3.5 text-cq-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ course().duration }}
            </span>

            <!-- Course Status if present -->
            @if (course().pivot?.status) {
              <span
                class="text-xs px-2 py-0.5 rounded font-medium ml-auto"
                [ngClass]="{
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': course().pivot?.status === 'completed',
                  'bg-cq-accent/15 text-cq-accent border border-cq-accent/30': course().pivot?.status === 'in_progress',
                  'text-cq-muted bg-cq-surface border border-cq-border/40': course().pivot?.status === 'pending'
                }"
              >
                {{ getStatusLabel(course().pivot?.status) }}
              </span>
            }
          </div>

          <!-- Course Title -->
          <h3 class="text-base sm:text-lg font-bold text-cq-text group-hover:text-cq-primary transition-colors leading-snug">
            {{ course().title }}
          </h3>

          <!-- Course Description -->
          <p class="text-sm text-cq-muted leading-relaxed">
            {{ course().description }}
          </p>

          <!-- Pedagogical Reason Callout (if available) -->
          @if (course().reason) {
            <div class="bg-cq-surface-hover/70 rounded-lg p-3 border-l-2 border-cq-accent text-xs sm:text-sm text-cq-text/90">
              <div class="flex items-center gap-1.5 font-semibold text-cq-accent mb-0.5">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Justificación pedagógica</span>
              </div>
              <p class="text-xs sm:text-sm text-cq-muted pl-5">
                {{ course().reason }}
              </p>
            </div>
          }

          <!-- Tech Tags -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            @for (tag of getTags(course().tags); track tag) {
              <span class="text-xs px-2 py-0.5 rounded bg-cq-surface-hover text-cq-muted border border-cq-border/60 hover:text-cq-text hover:border-cq-primary/40 transition-colors">
                {{ tag }}
              </span>
            }
          </div>
        </div>

        <!-- Right: Action Button -->
        <div class="sm:self-center shrink-0 pt-2 sm:pt-0">
          <a
            [href]="course().url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary text-xs sm:text-sm w-full sm:w-auto justify-center whitespace-nowrap shadow-sm group/btn"
          >
            <span>Ver en DevTalles</span>
            <svg class="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class CourseCardComponent {
  course = input.required<PathCourse>();
  step = input<number>(1);

  getLevelLabel(level?: string): string {
    switch (level) {
      case 'beginner':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return level || 'General';
    }
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in_progress':
        return 'En progreso';
      case 'pending':
      default:
        return 'Pendiente';
    }
  }

  getTags(tags?: (any | string)[]): string[] {
    if (!tags || !Array.isArray(tags)) return [];
    return tags.map((t) => (typeof t === 'string' ? t : t?.name || '')).filter(Boolean);
  }
}

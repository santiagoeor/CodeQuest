import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PathsService } from './services/paths.service';
import { PathRoadmapComponent } from './components/path-roadmap/path-roadmap.component';
import { LearningPath } from './models/path.model';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressService } from '../progress/services/progress.service';

@Component({
  selector: 'app-paths',
  standalone: true,
  imports: [CommonModule, RouterLink, PathRoadmapComponent, ContainerComponent],
  template: `
    <app-container>
      <div class="py-8 sm:py-12">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-cq-border">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cq-primary/10 border border-cq-primary/20 text-cq-primary text-xs font-semibold mb-2">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              Itinerarios Curados de DevTalles
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-cq-text">
              Mis Rutas de Aprendizaje
            </h1>
            <p class="text-sm text-cq-muted mt-1">
              Visualiza la secuencia de cursos recomendada, registra tu avance y mide tu progreso hacia tus metas.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <a
              routerLink="/assessment"
              class="btn-primary text-sm flex items-center gap-2 shadow-lg shadow-cq-primary/15"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span>Nuevo Diagnóstico</span>
            </a>
          </div>
        </div>

        @if (service.isLoading() && service.paths().length === 0) {
          <div class="py-24 text-center">
            <div class="inline-block w-12 h-12 border-4 border-cq-primary/30 border-t-cq-primary rounded-full animate-spin mb-4"></div>
            <h3 class="text-lg font-bold text-cq-text">Cargando tus rutas...</h3>
            <p class="text-cq-muted text-sm">Consultando tu itinerario personalizado</p>
          </div>
        } @else {
          @if (service.paths().length === 0) {
            <div class="card max-w-xl mx-auto p-8 sm:p-12 text-center border-dashed border-cq-border/80">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cq-primary/15 border border-cq-primary/30 flex items-center justify-center text-cq-primary">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-cq-text mb-2">Aún no tienes rutas guardadas</h3>
              <p class="text-sm text-cq-muted leading-relaxed mb-6">
                Realiza nuestro cuestionario interactivo de diagnóstico para que nuestro motor determinista genere tu primera ruta personalizada según tus conocimientos e intereses.
              </p>
              <a routerLink="/assessment" class="btn-primary inline-flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Comenzar Diagnóstico
              </a>
            </div>
          } @else {
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left: Saved Paths Sidebar (AC-3) -->
            <div class="lg:col-span-4 space-y-4">
              <div class="flex items-center justify-between px-1">
                <h2 class="text-sm font-bold uppercase tracking-wider text-cq-muted flex items-center gap-2">
                  <svg class="w-4 h-4 text-cq-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                  Tus Itinerarios ({{ service.paths().length }})
                </h2>
              </div>

              <!-- Paths List -->
              <div class="space-y-2.5">
                @for (path of service.paths(); track path.id) {
                  <div
                    (click)="selectPath(path)"
                    class="card p-4 cursor-pointer transition-all duration-200 border relative group text-left"
                    [class.border-cq-primary]="service.currentPath()?.id === path.id"
                    [class.bg-cq-primary]="service.currentPath()?.id === path.id"
                    [class.bg-opacity-10]="service.currentPath()?.id === path.id"
                    [class.hover:border-cq-border-hover]="service.currentPath()?.id !== path.id"
                  >
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <span
                        class="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                        [ngClass]="{
                          'bg-emerald-500/15 text-emerald-400': path.level === 'beginner',
                          'bg-sky-500/15 text-sky-400': path.level === 'intermediate',
                          'bg-purple-500/15 text-purple-400': path.level === 'advanced',
                          'bg-cq-surface text-cq-muted': !path.level
                        }"
                      >
                        {{ path.level || 'General' }}
                      </span>

                      <!-- Sidebar Progress Badge -->
                      <span
                        class="text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-1"
                        [ngClass]="isPathFullyCompleted(path.id)
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-cq-surface text-cq-muted border-cq-border/60'"
                      >
                        @if (isPathFullyCompleted(path.id)) {
                          <svg class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                          </svg>
                        }
                        {{ getPathProgressPct(path.id) }}%
                      </span>

                      <!-- Delete button -->
                      <button
                        (click)="confirmDelete(path, $event)"
                        class="text-cq-muted hover:text-cq-danger transition-colors p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 ml-auto"
                        title="Eliminar ruta"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>

                    <h4 class="text-sm font-bold text-cq-text group-hover:text-cq-primary transition-colors line-clamp-2">
                      {{ path.title }}
                    </h4>

                    <div class="flex items-center gap-3 text-xs text-cq-muted mt-2 pt-2 border-t border-cq-border/40">
                      <span>{{ path.courses.length || 0 }} cursos</span>
                      <span>•</span>
                      <span>{{ path.created_at | date:'dd MMM yyyy' }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Right: Active Roadmap Viewer (AC-1, AC-2, AC-4) -->
            <div class="lg:col-span-8 space-y-6">
              @if (service.currentPath(); as activePath) {
                
                <!-- Path Header Card with Reactive Progress Bar (AC-2) -->
                <div class="card p-6 sm:p-8 bg-gradient-to-br from-cq-surface via-cq-surface to-cq-surface-hover/50 border border-cq-border relative overflow-hidden">
                  <div class="absolute -right-12 -top-12 w-48 h-48 bg-cq-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      class="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border"
                      [ngClass]="{
                        'bg-emerald-500/15 text-emerald-400 border-emerald-500/30': activePath.level === 'beginner',
                        'bg-sky-500/15 text-sky-400 border-sky-500/30': activePath.level === 'intermediate',
                        'bg-purple-500/15 text-purple-400 border-purple-500/30': activePath.level === 'advanced',
                        'bg-cq-surface text-cq-muted border-cq-border': !activePath.level
                      }"
                    >
                      Nivel {{ activePath.level || 'Personalizado' }}
                    </span>

                    <span class="text-xs text-cq-muted px-2.5 py-1 rounded bg-cq-surface border border-cq-border/60">
                      {{ activePath.courses.length || 0 }} cursos en secuencia
                    </span>

                    @if (isPathFullyCompleted(activePath.id)) {
                      <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 ml-auto">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                        </svg>
                        Ruta 100% Completada
                      </span>
                    }
                  </div>

                  <h2 class="text-xl sm:text-2xl font-extrabold text-cq-text mb-3">
                    {{ activePath.title }}
                  </h2>

                  @if (activePath.description) {
                    <p class="text-sm text-cq-muted leading-relaxed mb-6">
                      {{ activePath.description }}
                    </p>
                  }

                  <!-- Reactive Progress Bar (AC-2) -->
                  <div class="space-y-2 pt-4 border-t border-cq-border/60">
                    <div class="flex items-center justify-between text-xs sm:text-sm">
                      <span class="font-bold text-cq-text flex items-center gap-2">
                        <svg class="w-4 h-4 text-cq-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                        Tu Progreso en esta Ruta
                      </span>
                      <div class="flex items-center gap-2">
                        <span class="text-cq-muted text-xs">
                          {{ getCompletedCount(activePath.id) }} de {{ activePath.courses.length }} cursos completados
                        </span>
                        <span
                          class="font-extrabold text-xs px-2.5 py-0.5 rounded border"
                          [ngClass]="isPathFullyCompleted(activePath.id)
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-cq-surface text-cq-accent border-cq-border'"
                        >
                          {{ getPathProgressPct(activePath.id) }}%
                        </span>
                      </div>
                    </div>

                    <!-- Animated Progress Bar Track -->
                    <div class="w-full h-3 bg-cq-surface rounded-full overflow-hidden border border-cq-border/80">
                      <div
                        class="h-full bg-gradient-to-r from-cq-primary via-cq-accent to-emerald-400 transition-all duration-500 ease-out rounded-full shadow-md"
                        [style.width.%]="getPathProgressPct(activePath.id)"
                      ></div>
                    </div>
                  </div>

                  <!-- Meta Info Bar -->
                  <div class="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-cq-muted pt-4 mt-4 border-t border-cq-border/60">
                    <div class="flex items-center gap-1.5">
                      <svg class="w-4 h-4 text-cq-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>{{ getTotalHours(activePath) }} de contenido</span>
                    </div>

                    <div class="flex items-center gap-1.5">
                      <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>Certificados oficiales en DevTalles</span>
                    </div>
                  </div>
                </div>

                <!-- Celebratory Banner when 100% completed (AC-4) -->
                @if (isPathFullyCompleted(activePath.id)) {
                  <div class="card p-6 bg-gradient-to-r from-emerald-500/15 via-cq-accent/15 to-emerald-500/10 border-2 border-emerald-500/40 animate-fade-in shadow-xl shadow-emerald-500/10">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                      <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20 text-2xl">
                        🎉
                      </div>
                      <div class="space-y-1.5 flex-1">
                        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <h3 class="text-lg sm:text-xl font-black text-emerald-400">
                            ¡Felicidades! Has completado el 100% de esta ruta
                          </h3>
                          <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                            Itinerario Completado
                          </span>
                        </div>
                        <p class="text-sm text-cq-text/90 leading-relaxed">
                          Has finalizado con éxito todos los cursos de esta ruta formativa de DevTalles. Continúa aprendiendo y trazando nuevos itinerarios para seguir potenciando tu carrera profesional.
                        </p>
                      </div>
                    </div>
                  </div>
                }

                <!-- Sequential Interactive Roadmap -->
                <app-path-roadmap
                  [courses]="activePath.courses || []"
                  [learningPathId]="activePath.id"
                />

              } @else {
                <div class="card p-12 text-center text-cq-muted">
                  Selecciona una ruta del panel para visualizar su itinerario interactivo.
                </div>
              }
            </div>

          </div>
          }
        }

      </div>
    </app-container>
  `,
})
export class PathsComponent implements OnInit {
  service = inject(PathsService);
  progressService = inject(ProgressService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    // Load overall completed course IDs
    this.progressService.loadOverallProgress().subscribe();

    // Check if an ID was passed in route params
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = parseInt(idParam, 10);
      if (!isNaN(id)) {
        this.service.loadPathById(id).subscribe((path) => {
          if (path) {
            this.progressService.loadPathProgress(path.id).subscribe();
          }
        });
      }
    }

    // Also load all user paths to populate sidebar
    this.service.loadUserPaths().subscribe((paths) => {
      if (idParam) {
        const found = paths.find((p) => p.id === parseInt(idParam, 10));
        if (found) {
          this.service.setCurrentPath(found);
          this.progressService.loadPathProgress(found.id).subscribe();
        }
      } else if (paths.length > 0 && !this.service.currentPath()) {
        this.service.setCurrentPath(paths[0]);
        this.progressService.loadPathProgress(paths[0].id).subscribe();
      }

      // Preload progress for all user paths so sidebar percentages are populated
      for (const p of paths) {
        this.progressService.loadPathProgress(p.id).subscribe();
      }
    });
  }

  selectPath(path: LearningPath): void {
    this.service.setCurrentPath(path);
    this.progressService.loadPathProgress(path.id).subscribe();
    this.router.navigate(['/paths', path.id], { replaceUrl: true });
  }

  confirmDelete(path: LearningPath, event: MouseEvent): void {
    event.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas eliminar la ruta "${path.title}"?`)) {
      this.service.deletePath(path.id).subscribe(() => {
        if (this.service.paths().length > 0) {
          const next = this.service.paths()[0];
          this.progressService.loadPathProgress(next.id).subscribe();
          this.router.navigate(['/paths', next.id], { replaceUrl: true });
        } else {
          this.router.navigate(['/paths'], { replaceUrl: true });
        }
      });
    }
  }

  getPathProgressPct(pathId: number): number {
    const metrics = this.progressService.getPathMetrics(pathId);
    if (metrics) {
      return metrics.progress_percentage;
    }
    // Fallback: calculate from path courses and completedCourseIds
    const path = this.service.paths().find((p) => p.id === pathId) || this.service.currentPath();
    if (path && path.id === pathId && path.courses?.length > 0) {
      const completed = path.courses.filter((c) => this.progressService.isCourseCompleted(c.id)).length;
      return Math.round((completed / path.courses.length) * 1000) / 10;
    }
    return 0;
  }

  getCompletedCount(pathId: number): number {
    const metrics = this.progressService.getPathMetrics(pathId);
    if (metrics) {
      return metrics.completed_courses_count;
    }
    const path = this.service.paths().find((p) => p.id === pathId) || this.service.currentPath();
    if (path && path.id === pathId && path.courses?.length > 0) {
      return path.courses.filter((c) => this.progressService.isCourseCompleted(c.id)).length;
    }
    return 0;
  }

  isPathFullyCompleted(pathId: number): boolean {
    const metrics = this.progressService.getPathMetrics(pathId);
    if (metrics && metrics.total_courses_count > 0) {
      return metrics.completed_courses_count === metrics.total_courses_count;
    }
    const path = this.service.paths().find((p) => p.id === pathId) || this.service.currentPath();
    if (path && path.id === pathId && path.courses?.length > 0) {
      return path.courses.every((c) => this.progressService.isCourseCompleted(c.id));
    }
    return false;
  }

  getTotalHours(path: LearningPath): string {
    if (!path.courses || path.courses.length === 0) return '0 horas';
    let total = 0;
    for (const c of path.courses) {
      const match = c.duration?.match(/\d+/);
      if (match) {
        total += parseInt(match[0], 10);
      }
    }
    return `${total} horas estimadas`;
  }
}

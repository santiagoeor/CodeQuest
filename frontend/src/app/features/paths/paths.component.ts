import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PathsService } from './services/paths.service';
import { PathRoadmapComponent } from './components/path-roadmap/path-roadmap.component';
import { LearningPath } from './models/path.model';
import { ContainerComponent } from '../../shared/components/container/container.component';

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
              Visualiza la secuencia de cursos recomendada y accede a cada módulo para avanzar hacia tus metas.
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

                      <!-- Delete button -->
                      <button
                        (click)="confirmDelete(path, $event)"
                        class="text-cq-muted hover:text-cq-danger transition-colors p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100"
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
                
                <!-- Path Header Card -->
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
                  </div>

                  <h2 class="text-xl sm:text-2xl font-extrabold text-cq-text mb-3">
                    {{ activePath.title }}
                  </h2>

                  @if (activePath.description) {
                    <p class="text-sm text-cq-muted leading-relaxed mb-6">
                      {{ activePath.description }}
                    </p>
                  }

                  <!-- Meta Info Bar -->
                  <div class="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-cq-muted pt-4 border-t border-cq-border/60">
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

                <!-- Sequential Interactive Roadmap -->
                <app-path-roadmap [courses]="activePath.courses || []" />

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    // Check if an ID was passed in route params
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = parseInt(idParam, 10);
      if (!isNaN(id)) {
        this.service.loadPathById(id).subscribe();
      }
    }

    // Also load all user paths to populate sidebar
    this.service.loadUserPaths().subscribe((paths) => {
      if (idParam) {
        const found = paths.find((p) => p.id === parseInt(idParam, 10));
        if (found) {
          this.service.setCurrentPath(found);
        }
      }
    });
  }

  selectPath(path: LearningPath): void {
    this.service.setCurrentPath(path);
    this.router.navigate(['/paths', path.id], { replaceUrl: true });
  }

  confirmDelete(path: LearningPath, event: MouseEvent): void {
    event.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas eliminar la ruta "${path.title}"?`)) {
      this.service.deletePath(path.id).subscribe(() => {
        if (this.service.paths().length > 0) {
          const next = this.service.paths()[0];
          this.router.navigate(['/paths', next.id], { replaceUrl: true });
        } else {
          this.router.navigate(['/paths'], { replaceUrl: true });
        }
      });
    }
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

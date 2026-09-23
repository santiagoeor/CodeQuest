import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CoursesService } from './services/courses.service';
import { CourseFormComponent } from './components/course-form/course-form.component';
import {
  Course,
  CourseTag,
  CreateCourseDto,
  UpdateCourseDto,
} from './models/course.model';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CourseFormComponent],
  template: `
    <div class="min-h-screen bg-cq-bg pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto space-y-8">

        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-cq-border pb-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cq-primary/15 text-cq-primary border border-cq-primary/30">
                DevTalles Catálogo
              </span>
              <span class="text-xs text-cq-muted font-mono">
                {{ filteredCourses().length }} cursos disponibles
              </span>
            </div>
            <h1 class="text-3xl font-extrabold text-cq-text tracking-tight sm:text-4xl">
              Cursos y Especializaciones
            </h1>
            <p class="text-sm sm:text-base text-cq-muted mt-1 max-w-2xl">
              Explora, gestiona y administra los cursos oficiales de DevTalles vinculados a las rutas pedagógicas de aprendizaje.
            </p>
          </div>

          <!-- Add Course Button -->
          <div class="flex items-center gap-3">
            <button
              (click)="openCreateModal()"
              class="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-lg hover:shadow-cq-primary/20 transition-all text-sm font-semibold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Nuevo Curso</span>
            </button>
          </div>
        </div>

        <!-- Success & Error Alert Banners (AC-4) -->
        @if (successMessage()) {
          <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between animate-fadeIn shadow-lg">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm font-medium">{{ successMessage() }}</span>
            </div>
            <button (click)="clearFeedback()" class="text-emerald-400 hover:text-emerald-200 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        }

        @if (errorMessage()) {
          <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-center justify-between animate-fadeIn shadow-lg">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm font-medium">{{ errorMessage() }}</span>
            </div>
            <button (click)="clearFeedback()" class="text-rose-400 hover:text-rose-200 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        }

        <!-- Search & Filter Controls -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-cq-surface p-4 rounded-2xl border border-cq-border">
          <!-- Search input -->
          <div class="relative md:col-span-2">
            <input
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Buscar curso por título, descripción o tecnología..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cq-surface-hover/60 border border-cq-border text-cq-text placeholder-cq-muted/60 focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm" />
            <svg class="w-4 h-4 text-cq-muted absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <!-- Level filter -->
          <div>
            <select
              [ngModel]="selectedLevel()"
              (ngModelChange)="selectedLevel.set($event)"
              class="w-full px-4 py-2.5 rounded-xl bg-cq-surface-hover/60 border border-cq-border text-cq-text focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm cursor-pointer">
              <option value="all">Todos los Niveles</option>
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="p-6 rounded-2xl bg-cq-surface border border-cq-border animate-pulse space-y-4">
                <div class="h-4 bg-cq-surface-hover rounded w-1/3"></div>
                <div class="h-6 bg-cq-surface-hover rounded w-4/5"></div>
                <div class="h-16 bg-cq-surface-hover rounded"></div>
                <div class="h-8 bg-cq-surface-hover rounded w-1/2"></div>
              </div>
            }
          </div>
        } @else if (filteredCourses().length === 0) {
          <!-- Empty State -->
          <div class="text-center py-16 px-4 rounded-2xl bg-cq-surface border border-cq-border space-y-4">
            <div class="w-12 h-12 rounded-full bg-cq-surface-hover text-cq-muted mx-auto flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-cq-text">No se encontraron cursos</h3>
            <p class="text-sm text-cq-muted max-w-sm mx-auto">
              No hay cursos que coincidan con los criterios de búsqueda o aún no se han registrado cursos en el catálogo.
            </p>
            <button
              (click)="openCreateModal()"
              class="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Crear primer curso
            </button>
          </div>
        } @else {
          <!-- Courses Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (course of filteredCourses(); track course.id) {
              <div class="flex flex-col justify-between bg-cq-surface hover:bg-cq-surface-hover/30 border border-cq-border hover:border-cq-primary/40 rounded-2xl p-6 transition-all duration-200 group shadow-sm hover:shadow-xl">
                <div>
                  <!-- Top Bar: Level & Duration -->
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                      [ngClass]="getLevelBadgeClasses(course.level)">
                      {{ course.level }}
                    </span>

                    <span class="text-xs text-cq-muted font-mono flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ course.duration }}
                    </span>
                  </div>

                  <!-- Course Title -->
                  <h3 class="text-lg font-bold text-cq-text group-hover:text-cq-primary transition-colors line-clamp-2 mb-2">
                    {{ course.title }}
                  </h3>

                  <!-- Course Description / Pedagogical Reason -->
                  <p class="text-xs sm:text-sm text-cq-muted line-clamp-3 mb-4 leading-relaxed">
                    {{ course.description }}
                  </p>

                  <!-- Tags -->
                  <div class="flex flex-wrap gap-1.5 mb-6">
                    @for (tag of getTagsList(course.tags); track tag) {
                      <span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-cq-surface-hover text-cq-muted border border-cq-border">
                        {{ tag }}
                      </span>
                    }
                  </div>
                </div>

                <!-- Card Actions (DevTalles link + Edit Button) -->
                <div class="flex items-center justify-between pt-4 border-t border-cq-border/60 gap-2">
                  <a
                    [href]="course.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-xs font-semibold text-cq-primary hover:text-cq-primary/80 inline-flex items-center gap-1.5 transition-colors">
                    <span>DevTalles</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>

                  <button
                    (click)="openEditModal(course)"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium text-cq-muted hover:text-cq-text bg-cq-surface-hover border border-cq-border hover:border-cq-primary/40 transition-colors inline-flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <span>Editar</span>
                  </button>
                </div>
              </div>
            }
          </div>
        }

        <!-- Course Modal / Dialog (AC-2) -->
        @if (isModalOpen()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-fadeIn">
            <div class="relative w-full max-w-2xl my-8">
              <app-course-form
                [course]="selectedCourse()"
                [isSubmitting]="isSaving()"
                (formSubmit)="onFormSubmit($event)"
                (formCancel)="closeModal()">
              </app-course-form>
            </div>
          </div>
        }

      </div>
    </div>
  `,
})
export class CoursesComponent implements OnInit {
  private coursesService = inject(CoursesService);
  private authService = inject(AuthService);

  readonly courses = this.coursesService.courses;
  readonly isLoading = this.coursesService.isLoading;
  readonly isSaving = this.coursesService.isSaving;
  readonly errorMessage = this.coursesService.error;
  readonly successMessage = this.coursesService.successMessage;

  readonly isModalOpen = signal<boolean>(false);
  readonly selectedCourse = signal<Course | null>(null);

  readonly searchQuery = signal<string>('');
  readonly selectedLevel = signal<string>('all');

  // Computed filtered courses based on search & level
  readonly filteredCourses = computed(() => {
    const list = this.courses();
    const query = this.searchQuery().toLowerCase().trim();
    const level = this.selectedLevel();

    return list.filter((course) => {
      // Level filter
      if (level !== 'all' && course.level.toLowerCase() !== level.toLowerCase()) {
        return false;
      }

      // Search query filter
      if (!query) return true;

      const titleMatch = course.title.toLowerCase().includes(query);
      const descMatch = (course.description || '').toLowerCase().includes(query);
      const tagsMatch = (course.tags || []).some((tag) => {
        const name = typeof tag === 'string' ? tag : tag.name;
        return name.toLowerCase().includes(query);
      });

      return titleMatch || descMatch || tagsMatch;
    });
  });

  ngOnInit(): void {
    this.coursesService.loadCourses().subscribe();
  }

  openCreateModal(): void {
    this.selectedCourse.set(null);
    this.coursesService.clearFeedback();
    this.isModalOpen.set(true);
  }

  openEditModal(course: Course): void {
    this.selectedCourse.set(course);
    this.coursesService.clearFeedback();
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedCourse.set(null);
  }

  clearFeedback(): void {
    this.coursesService.clearFeedback();
  }

  onFormSubmit(event: {
    mode: 'create' | 'edit';
    courseId?: number;
    dto: CreateCourseDto | UpdateCourseDto;
  }): void {
    if (event.mode === 'create') {
      this.coursesService.createCourse(event.dto as CreateCourseDto).subscribe({
        next: () => {
          this.closeModal();
        },
      });
    } else if (event.mode === 'edit' && event.courseId) {
      this.coursesService.updateCourse(event.courseId, event.dto as UpdateCourseDto).subscribe({
        next: () => {
          this.closeModal();
        },
      });
    }
  }

  getTagsList(tags?: (CourseTag | string)[]): string[] {
    if (!tags || !Array.isArray(tags)) return [];
    return tags.map((t) => (typeof t === 'string' ? t : t.name));
  }

  getLevelBadgeClasses(level: string): string {
    const lvl = (level || '').toLowerCase();
    switch (lvl) {
      case 'beginner':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'intermediate':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'advanced':
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/30';
      default:
        return 'bg-cq-surface-hover text-cq-muted border border-cq-border';
    }
  }
}

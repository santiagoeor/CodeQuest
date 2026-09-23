import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Course,
  CourseTag,
  CreateCourseDto,
  UpdateCourseDto,
} from '../../models/course.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-cq-surface border border-cq-border rounded-2xl p-6 sm:p-8 shadow-2xl relative">
      <!-- Header -->
      <div class="flex items-center justify-between pb-6 border-b border-cq-border mb-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-cq-text flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" [ngClass]="isEditMode() ? 'bg-amber-400' : 'bg-cq-primary'"></span>
            {{ isEditMode() ? 'Editar Curso' : 'Nuevo Curso' }}
          </h2>
          <p class="text-xs sm:text-sm text-cq-muted mt-1">
            {{ isEditMode() ? 'Modifica los detalles pedagógicos y técnicos del curso seleccionado.' : 'Registra un nuevo curso de DevTalles en el catálogo.' }}
          </p>
        </div>

        <button
          type="button"
          (click)="onCancel()"
          class="text-cq-muted hover:text-cq-text p-2 rounded-lg hover:bg-cq-surface-hover transition-colors"
          title="Cerrar formulario">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">

        <!-- Title & Slug -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-xs font-semibold text-cq-text uppercase tracking-wider mb-2">
              Título del Curso <span class="text-rose-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              formControlName="title"
              placeholder="Ej: Angular Pro: De Cero a Experto"
              (input)="onTitleChange()"
              class="w-full px-4 py-2.5 rounded-xl bg-cq-surface-hover/60 border border-cq-border text-cq-text placeholder-cq-muted/50 focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm"
              [class.border-rose-500]="isFieldInvalid('title')" />

            @if (isFieldInvalid('title')) {
              <p class="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                El título es obligatorio (mínimo 3 caracteres).
              </p>
            }
          </div>

          <!-- Slug -->
          <div>
            <label for="slug" class="block text-xs font-semibold text-cq-text uppercase tracking-wider mb-2">
              Slug Identificador
            </label>
            <input
              id="slug"
              type="text"
              formControlName="slug"
              placeholder="ej: angular-pro-de-cero-a-experto"
              class="w-full px-4 py-2.5 rounded-xl bg-cq-surface-hover/60 border border-cq-border text-cq-text placeholder-cq-muted/50 focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm"
              [class.border-rose-500]="isFieldInvalid('slug')" />

            @if (isFieldInvalid('slug')) {
              <p class="text-xs text-rose-400 mt-1.5">Formato slug inválido (solo minúsculas, números y guiones).</p>
            }
          </div>
        </div>

        <!-- Level & Duration -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- Level -->
          <div>
            <label for="level" class="block text-xs font-semibold text-cq-text uppercase tracking-wider mb-2">
              Nivel de Dificultad <span class="text-rose-400">*</span>
            </label>
            <select
              id="level"
              formControlName="level"
              class="w-full px-4 py-2.5 rounded-xl bg-cq-surface border border-cq-border text-cq-text focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm cursor-pointer"
              [class.border-rose-500]="isFieldInvalid('level')">
              <option value="beginner">Principiante (Beginner)</option>
              <option value="intermediate">Intermedio (Intermediate)</option>
              <option value="advanced">Avanzado (Advanced)</option>
            </select>
          </div>

          <!-- Duration -->
          <div>
            <label for="duration" class="block text-xs font-semibold text-cq-text uppercase tracking-wider mb-2">
              Duración Estimada <span class="text-rose-400">*</span>
            </label>
            <input
              id="duration"
              type="text"
              formControlName="duration"
              placeholder="Ej: 24 horas o 10h 30m"
              class="w-full px-4 py-2.5 rounded-xl bg-cq-surface-hover/60 border border-cq-border text-cq-text placeholder-cq-muted/50 focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm"
              [class.border-rose-500]="isFieldInvalid('duration')" />

            @if (isFieldInvalid('duration')) {
              <p class="text-xs text-rose-400 mt-1.5">La duración es obligatoria.</p>
            }
          </div>
        </div>

        <!-- URLs: DevTalles Link & Image URL -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- URL -->
          <div>
            <label for="url" class="block text-xs font-semibold text-cq-text uppercase tracking-wider mb-2">
              Enlace a DevTalles <span class="text-rose-400">*</span>
            </label>
            <input
              id="url"
              type="url"
              formControlName="url"
              placeholder="https://devtalles.com/courses/..."
              class="w-full px-4 py-2.5 rounded-xl bg-cq-surface-hover/60 border border-cq-border text-cq-text placeholder-cq-muted/50 focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm"
              [class.border-rose-500]="isFieldInvalid('url')" />

            @if (isFieldInvalid('url')) {
              <p class="text-xs text-rose-400 mt-1.5">Debe ser una URL válida (ej: https://devtalles.com/...).</p>
            }
          </div>

          <!-- Image URL -->
          <div>
            <label for="image_url" class="block text-xs font-semibold text-cq-text uppercase tracking-wider mb-2">
              URL de Imagen / Thumbnail
            </label>
            <input
              id="image_url"
              type="url"
              formControlName="image_url"
              placeholder="https://... o dejar vacío"
              class="w-full px-4 py-2.5 rounded-xl bg-cq-surface-hover/60 border border-cq-border text-cq-text placeholder-cq-muted/50 focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm"
              [class.border-rose-500]="isFieldInvalid('image_url')" />

            @if (isFieldInvalid('image_url')) {
              <p class="text-xs text-rose-400 mt-1.5">Debe ser una URL válida (http/https).</p>
            }
          </div>
        </div>

        <!-- Description / Pedagogical Reason -->
        <div>
          <label for="description" class="block text-xs font-semibold text-cq-text uppercase tracking-wider mb-2">
            Razón Pedagógica y Descripción <span class="text-rose-400">*</span>
          </label>
          <textarea
            id="description"
            rows="3"
            formControlName="description"
            placeholder="Explica el objetivo pedagógico del curso, qué habilidades clave desarrolla y por qué es esencial en la ruta de aprendizaje..."
            class="w-full px-4 py-2.5 rounded-xl bg-cq-surface-hover/60 border border-cq-border text-cq-text placeholder-cq-muted/50 focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm resize-y"
            [class.border-rose-500]="isFieldInvalid('description')"></textarea>

          @if (isFieldInvalid('description')) {
            <p class="text-xs text-rose-400 mt-1.5">La descripción es obligatoria (mínimo 10 caracteres).</p>
          }
        </div>

        <!-- Tags Selector (AC-3) -->
        <div class="space-y-3">
          <label class="block text-xs font-semibold text-cq-text uppercase tracking-wider">
            Tecnologías y Etiquetas (Tags)
          </label>

          <!-- Input for adding tags -->
          <div class="flex items-center gap-2">
            <input
              type="text"
              #customTagInput
              [value]="tagInput()"
              (input)="tagInput.set(customTagInput.value)"
              (keydown.enter)="$event.preventDefault(); addCustomTag(customTagInput)"
              placeholder="Escribe una tecnología (ej: NestJS, RxJS) y presiona Enter"
              class="flex-1 px-4 py-2 rounded-xl bg-cq-surface-hover/60 border border-cq-border text-cq-text placeholder-cq-muted/50 focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm" />

            <button
              type="button"
              (click)="addCustomTag(customTagInput)"
              class="px-4 py-2 rounded-xl bg-cq-primary/15 text-cq-primary border border-cq-primary/30 hover:bg-cq-primary/25 font-semibold text-sm transition-colors flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Añadir
            </button>
          </div>

          <!-- Active tags chips -->
          <div class="flex flex-wrap gap-2 min-h-[32px] p-2.5 rounded-xl bg-cq-surface-hover/30 border border-cq-border/60 items-center">
            @if (tags().length === 0) {
              <span class="text-xs text-cq-muted italic">No hay etiquetas seleccionadas. Elige una de las sugerencias abajo o escribe una arriba.</span>
            }

            @for (t of tags(); track t) {
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cq-primary/20 text-cq-primary border border-cq-primary/30 animate-fadeIn">
                {{ t }}
                <button
                  type="button"
                  (click)="removeTag(t)"
                  class="text-cq-primary/70 hover:text-cq-primary hover:bg-cq-primary/30 rounded-full p-0.5 transition-colors"
                  [attr.aria-label]="'Eliminar tag ' + t">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            }
          </div>

          <!-- Suggested tags quick-add -->
          <div>
            <p class="text-xs text-cq-muted mb-2">Sugerencias rápidas:</p>
            <div class="flex flex-wrap gap-1.5">
              @for (suggestion of suggestedTags; track suggestion) {
                <button
                  type="button"
                  (click)="addSuggestedTag(suggestion)"
                  [disabled]="tags().includes(suggestion)"
                  class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                  [ngClass]="tags().includes(suggestion) ? 'bg-cq-surface-hover/30 text-cq-muted/40 cursor-not-allowed border border-transparent' : 'bg-cq-surface-hover/80 text-cq-muted hover:text-cq-text border border-cq-border hover:border-cq-primary/40'">
                  + {{ suggestion }}
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-cq-border">
          <button
            type="button"
            (click)="onCancel()"
            [disabled]="isSubmitting"
            class="px-5 py-2.5 rounded-xl text-sm font-medium text-cq-muted hover:text-cq-text hover:bg-cq-surface-hover transition-colors">
            Cancelar
          </button>

          <button
            type="submit"
            [disabled]="form.invalid || isSubmitting"
            class="btn-primary px-6 py-2.5 text-sm font-semibold rounded-xl inline-flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            @if (isSubmitting) {
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Guardando...</span>
            } @else {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>{{ isEditMode() ? 'Actualizar Curso' : 'Crear Curso' }}</span>
            }
          </button>
        </div>
      </form>
    </div>
  `,
})
export class CourseFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() course: Course | null = null;
  @Input() isSubmitting = false;

  @Output() formSubmit = new EventEmitter<{
    mode: 'create' | 'edit';
    courseId?: number;
    dto: CreateCourseDto | UpdateCourseDto;
  }>();
  @Output() formCancel = new EventEmitter<void>();

  readonly tags = signal<string[]>([]);
  readonly tagInput = signal<string>('');

  readonly isEditMode = computed(() => !!this.course);

  readonly suggestedTags = [
    'Angular',
    'TypeScript',
    'NestJS',
    'RxJS',
    'Docker',
    'Tailwind CSS',
    'PHP',
    'Laravel',
    'Node.js',
    'MySQL',
    'PostgreSQL',
    'Git',
  ];

  form: FormGroup = this.createForm();

  ngOnInit(): void {
    if (this.course) {
      this.populateForm(this.course);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course'] && this.course) {
      this.populateForm(this.course);
    } else if (changes['course'] && !this.course) {
      this.resetForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      slug: ['', [Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      level: ['beginner', [Validators.required]],
      duration: ['', [Validators.required]],
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      image_url: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    });
  }

  private populateForm(course: Course): void {
    this.form.patchValue({
      title: course.title,
      slug: course.slug,
      description: course.description,
      level: course.level,
      duration: course.duration,
      url: course.url,
      image_url: course.image_url || '',
    });

    const extractedTags: string[] = (course.tags || []).map((t: CourseTag | string) =>
      typeof t === 'string' ? t : t.name
    );
    this.tags.set(extractedTags);
  }

  resetForm(): void {
    this.form.reset({
      level: 'beginner',
    });
    this.tags.set([]);
    this.tagInput.set('');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onTitleChange(): void {
    if (!this.isEditMode()) {
      const title = this.form.get('title')?.value || '';
      const slug = this.slugify(title);
      this.form.patchValue({ slug }, { emitEvent: false });
    }
  }

  addCustomTag(inputEl: HTMLInputElement): void {
    const value = (inputEl.value || '').trim();
    if (value) {
      this.addTag(value);
      inputEl.value = '';
      this.tagInput.set('');
    }
  }

  addSuggestedTag(tag: string): void {
    this.addTag(tag);
  }

  private addTag(tag: string): void {
    const cleanTag = tag.trim();
    if (!cleanTag) return;

    const current = this.tags();
    const exists = current.some((t) => t.toLowerCase() === cleanTag.toLowerCase());
    if (!exists) {
      this.tags.set([...current, cleanTag]);
    }
  }

  removeTag(tagToRemove: string): void {
    this.tags.set(this.tags().filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase()));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formVal = this.form.value;
    const dto: CreateCourseDto | UpdateCourseDto = {
      title: formVal.title.trim(),
      slug: formVal.slug ? formVal.slug.trim() : undefined,
      description: formVal.description.trim(),
      level: formVal.level,
      duration: formVal.duration.trim(),
      url: formVal.url.trim(),
      image_url: formVal.image_url ? formVal.image_url.trim() : null,
      tags: this.tags(),
    };

    if (this.isEditMode() && this.course) {
      this.formSubmit.emit({
        mode: 'edit',
        courseId: this.course.id,
        dto,
      });
    } else {
      this.formSubmit.emit({
        mode: 'create',
        dto: dto as CreateCourseDto,
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Course,
  CoursesResponse,
  CreateCourseDto,
  SingleCourseResponse,
  UpdateCourseDto,
} from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  // Reactive state signals
  readonly courses = signal<Course[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  /**
   * Load all courses from the catalog.
   */
  loadCourses(): Observable<Course[]> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<CoursesResponse>(this.apiUrl).pipe(
      map((res) => res.data || []),
      tap((courses) => {
        this.courses.set(courses);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Error al cargar el catálogo de cursos.';
        this.error.set(msg);
        return throwError(() => err);
      })
    );
  }

  /**
   * Fetch a single course by slug or ID.
   */
  getCourse(slugOrId: string | number): Observable<Course> {
    return this.http.get<SingleCourseResponse>(`${this.apiUrl}/${slugOrId}`).pipe(
      map((res) => res.data),
      catchError((err) => {
        const msg = err.error?.message || 'Curso no encontrado.';
        return throwError(() => new Error(msg));
      })
    );
  }

  /**
   * Create a new course in the catalog and update local signal reactively.
   */
  createCourse(dto: CreateCourseDto): Observable<Course> {
    this.isSaving.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    return this.http.post<SingleCourseResponse>(this.apiUrl, dto).pipe(
      map((res) => res.data),
      tap((newCourse) => {
        this.isSaving.set(false);
        this.successMessage.set('¡Curso creado exitosamente!');
        // Update local state reactively
        this.courses.update((current) => [newCourse, ...current]);
      }),
      catchError((err) => {
        this.isSaving.set(false);
        const msg = err.error?.message || 'Error al crear el curso. Revisa los datos ingresados.';
        this.error.set(msg);
        return throwError(() => err);
      })
    );
  }

  /**
   * Update an existing course and update local signal reactively.
   */
  updateCourse(id: number, dto: UpdateCourseDto): Observable<Course> {
    this.isSaving.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    return this.http.put<SingleCourseResponse>(`${this.apiUrl}/${id}`, dto).pipe(
      map((res) => res.data),
      tap((updatedCourse) => {
        this.isSaving.set(false);
        this.successMessage.set('¡Curso actualizado exitosamente!');
        // Update local state reactively
        this.courses.update((current) =>
          current.map((c) => (c.id === id ? updatedCourse : c))
        );
      }),
      catchError((err) => {
        this.isSaving.set(false);
        const msg = err.error?.message || 'Error al actualizar el curso.';
        this.error.set(msg);
        return throwError(() => err);
      })
    );
  }

  /**
   * Clear error or success messages.
   */
  clearFeedback(): void {
    this.error.set(null);
    this.successMessage.set(null);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  LearningPath,
  LearningPathsResponse,
  SavePathRequest,
  SingleLearningPathResponse,
} from '../models/path.model';

@Injectable({
  providedIn: 'root',
})
export class PathsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/learning-paths`;

  // Reactive state signals
  readonly paths = signal<LearningPath[]>([]);
  readonly currentPath = signal<LearningPath | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Load all saved learning paths for the authenticated user.
   */
  loadUserPaths(): Observable<LearningPath[]> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<LearningPathsResponse>(this.apiUrl).pipe(
      map((res) => res.data || []),
      tap((paths) => {
        this.paths.set(paths);
        this.isLoading.set(false);
        // Automatically select the first path if none selected and paths exist
        if (!this.currentPath() && paths.length > 0) {
          this.currentPath.set(paths[0]);
        }
      }),
      catchError((err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Error al cargar las rutas de aprendizaje.';
        this.error.set(msg);
        return of([]);
      })
    );
  }

  /**
   * Load a single learning path with its ordered courses by ID.
   */
  loadPathById(id: number): Observable<LearningPath | null> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<SingleLearningPathResponse>(`${this.apiUrl}/${id}`).pipe(
      map((res) => res.data),
      tap((path) => {
        this.currentPath.set(path);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Ruta de aprendizaje no encontrada.';
        this.error.set(msg);
        return of(null);
      })
    );
  }

  /**
   * Persist a new learning path.
   */
  savePath(request: SavePathRequest): Observable<LearningPath> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<SingleLearningPathResponse>(this.apiUrl, request).pipe(
      map((res) => res.data),
      tap((savedPath) => {
        // Prepend to current list
        this.paths.update((prev) => [savedPath, ...prev.filter((p) => p.id !== savedPath.id)]);
        this.currentPath.set(savedPath);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Error al guardar la ruta de aprendizaje.';
        this.error.set(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  /**
   * Delete an existing learning path by ID.
   */
  deletePath(id: number): Observable<boolean> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.delete<{ status: string; message?: string }>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.paths.update((prev) => prev.filter((p) => p.id !== id));
        if (this.currentPath()?.id === id) {
          const remaining = this.paths();
          this.currentPath.set(remaining.length > 0 ? remaining[0] : null);
        }
        this.isLoading.set(false);
      }),
      map(() => true),
      catchError((err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Error al eliminar la ruta de aprendizaje.';
        this.error.set(msg);
        return of(false);
      })
    );
  }

  /**
   * Manually select a path as active.
   */
  setCurrentPath(path: LearningPath | null): void {
    this.currentPath.set(path);
  }
}

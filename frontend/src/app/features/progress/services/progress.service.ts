import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  OverallProgressData,
  PathProgressMetrics,
  ProgressApiResponse,
  ToggleProgressData,
} from '../models/progress.model';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Set of course IDs completed by the user
  readonly completedCourseIds = signal<Set<number>>(new Set());

  // Metrics cache by learning_path_id
  readonly metricsByPath = signal<Map<number, PathProgressMetrics>>(new Map());

  // Loading states
  readonly isLoading = signal<boolean>(false);
  readonly isTogglingCourse = signal<Set<number>>(new Set());

  /**
   * Check if a specific course is marked as completed (AC-1, AC-3).
   */
  isCourseCompleted(courseId: number): boolean {
    return this.completedCourseIds().has(courseId);
  }

  /**
   * Get metrics for a specific learning path (AC-2).
   */
  getPathMetrics(learningPathId: number): PathProgressMetrics | undefined {
    return this.metricsByPath().get(learningPathId);
  }

  /**
   * Check if a learning path is 100% completed (AC-4).
   */
  isPathFullyCompleted(learningPathId: number): boolean {
    const metrics = this.getPathMetrics(learningPathId);
    if (!metrics || metrics.total_courses_count === 0) return false;
    return metrics.completed_courses_count === metrics.total_courses_count;
  }

  /**
   * Load overall progress entries for the user.
   */
  loadOverallProgress(): Observable<OverallProgressData> {
    this.isLoading.set(true);

    return this.http
      .get<ProgressApiResponse<OverallProgressData>>(`${this.apiUrl}/progress`)
      .pipe(
        map((res) => res.data),
        tap((data) => {
          this.isLoading.set(false);
          const completedSet = new Set<number>(data.completed_course_ids || []);
          this.completedCourseIds.set(completedSet);
        }),
        catchError((err) => {
          this.isLoading.set(false);
          return throwError(() => err);
        })
      );
  }

  /**
   * Load progress and percentage metrics for a specific learning path (AC-2).
   */
  loadPathProgress(learningPathId: number): Observable<PathProgressMetrics> {
    this.isLoading.set(true);

    return this.http
      .get<ProgressApiResponse<PathProgressMetrics>>(
        `${this.apiUrl}/progress?learning_path_id=${learningPathId}`
      )
      .pipe(
        map((res) => res.data),
        tap((metrics) => {
          this.isLoading.set(false);
          // Update completed courses set with items from this path
          const currentSet = new Set(this.completedCourseIds());
          for (const id of metrics.completed_course_ids || []) {
            currentSet.add(id);
          }
          this.completedCourseIds.set(currentSet);

          // Update metrics map
          const currentMetricsMap = new Map(this.metricsByPath());
          currentMetricsMap.set(learningPathId, metrics);
          this.metricsByPath.set(currentMetricsMap);
        }),
        catchError((err) => {
          this.isLoading.set(false);
          return throwError(() => err);
        })
      );
  }

  /**
   * Toggle completion status of a course with optimistic UI update (AC-1, AC-3).
   *
   * @param courseId The course being toggled
   * @param learningPathId Optional path ID the course belongs to
   * @param pathCourseIds Optional array of all course IDs in the current path to update metrics immediately
   */
  toggleCourseProgress(
    courseId: number,
    learningPathId?: number,
    pathCourseIds?: number[]
  ): Observable<ToggleProgressData> {
    const currentCompleted = this.completedCourseIds();
    const wasCompleted = currentCompleted.has(courseId);
    const nextCompleted = !wasCompleted;

    // 1. OPTIMISTIC UPDATE: Immediate update of completedCourseIds
    const nextSet = new Set(currentCompleted);
    if (nextCompleted) {
      nextSet.add(courseId);
    } else {
      nextSet.delete(courseId);
    }
    this.completedCourseIds.set(nextSet);

    // 2. OPTIMISTIC UPDATE: Immediate update of path metrics if path info is provided
    let previousMetrics: PathProgressMetrics | undefined;
    if (learningPathId && pathCourseIds) {
      previousMetrics = this.getPathMetrics(learningPathId);
      const total = pathCourseIds.length;
      const completedIds = pathCourseIds.filter((id) => nextSet.has(id));
      const completedCount = completedIds.length;
      const percentage = total > 0 ? Math.round((completedCount / total) * 1000) / 10 : 0;

      const optimisticMetrics: PathProgressMetrics = {
        learning_path_id: learningPathId,
        total_courses_count: total,
        completed_courses_count: completedCount,
        progress_percentage: percentage,
        completed_course_ids: completedIds,
      };

      const metricsMap = new Map(this.metricsByPath());
      metricsMap.set(learningPathId, optimisticMetrics);
      this.metricsByPath.set(metricsMap);
    }

    // Mark as pending network
    const toggling = new Set(this.isTogglingCourse());
    toggling.add(courseId);
    this.isTogglingCourse.set(toggling);

    const payload: { course_id: number; learning_path_id?: number } = {
      course_id: courseId,
    };
    if (learningPathId) {
      payload.learning_path_id = learningPathId;
    }

    return this.http
      .post<ProgressApiResponse<ToggleProgressData>>(`${this.apiUrl}/progress/toggle`, payload)
      .pipe(
        map((res) => res.data),
        tap((data) => {
          // Remove from in-flight toggles
          const currentToggling = new Set(this.isTogglingCourse());
          currentToggling.delete(courseId);
          this.isTogglingCourse.set(currentToggling);

          // Confirm exact state from backend
          const confirmedSet = new Set(this.completedCourseIds());
          if (data.is_completed) {
            confirmedSet.add(courseId);
          } else {
            confirmedSet.delete(courseId);
          }
          this.completedCourseIds.set(confirmedSet);

          if (data.learning_path_id && data.progress_percentage !== null) {
            const confirmedMetrics: PathProgressMetrics = {
              learning_path_id: data.learning_path_id,
              total_courses_count: data.total_courses_count ?? 0,
              completed_courses_count: data.completed_courses_count ?? 0,
              progress_percentage: Number(data.progress_percentage),
              completed_course_ids: data.completed_course_ids || [],
            };
            const updatedMap = new Map(this.metricsByPath());
            updatedMap.set(data.learning_path_id, confirmedMetrics);
            this.metricsByPath.set(updatedMap);
          }
        }),
        catchError((err) => {
          // ROLLBACK: Revert optimistic update on failure
          const rollbackSet = new Set(this.completedCourseIds());
          if (wasCompleted) {
            rollbackSet.add(courseId);
          } else {
            rollbackSet.delete(courseId);
          }
          this.completedCourseIds.set(rollbackSet);

          if (learningPathId && previousMetrics) {
            const rollbackMetricsMap = new Map(this.metricsByPath());
            rollbackMetricsMap.set(learningPathId, previousMetrics);
            this.metricsByPath.set(rollbackMetricsMap);
          }

          const currentToggling = new Set(this.isTogglingCourse());
          currentToggling.delete(courseId);
          this.isTogglingCourse.set(currentToggling);

          return throwError(() => err);
        })
      );
  }
}

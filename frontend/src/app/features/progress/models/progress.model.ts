export interface PathProgressMetrics {
  learning_path_id: number;
  total_courses_count: number;
  completed_courses_count: number;
  progress_percentage: number;
  completed_course_ids: number[];
}

export interface ProgressApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface ToggleProgressData {
  course_id: number;
  is_completed: boolean;
  completed_at: string | null;
  learning_path_id: number | null;
  total_courses_count: number | null;
  completed_courses_count: number | null;
  progress_percentage: number | null;
  completed_course_ids: number[];
}

export interface OverallProgressData {
  completed_course_ids: number[];
  progress_entries: {
    id: number;
    user_id: number;
    course_id: number;
    is_completed: boolean;
    completed_at: string | null;
  }[];
}

export interface CourseTag {
  id?: number;
  name: string;
  slug?: string;
}

export interface PathCoursePivot {
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | string;
  learning_path_id?: number;
  course_id?: number;
}

export interface PathCourse {
  id: number;
  title: string;
  slug: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | string;
  duration: string;
  url: string;
  image_url: string;
  tags: (CourseTag | string)[];
  pivot?: PathCoursePivot;
  order?: number;
  step?: number;
  reason?: string;
}

export interface LearningPath {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  level: string | null;
  status: 'active' | 'completed' | 'archived' | string;
  created_at: string;
  updated_at: string;
  courses: PathCourse[];
}

export interface LearningPathsResponse {
  status: string;
  count: number;
  data: LearningPath[];
}

export interface SingleLearningPathResponse {
  status: string;
  data: LearningPath;
}

export interface SavePathRequest {
  title: string;
  description?: string | null;
  level?: string | null;
  status?: string;
  course_ids?: number[];
  courses?: {
    id?: number;
    course_id?: number;
    order?: number;
  }[];
}

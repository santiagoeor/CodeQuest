export interface CourseTag {
  id?: number;
  name: string;
  slug?: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | string;
  duration: string;
  url: string;
  image_url?: string | null;
  tags?: (CourseTag | string)[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateCourseDto {
  title: string;
  slug?: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  url: string;
  image_url?: string | null;
  tags?: string[];
}

export interface UpdateCourseDto {
  title?: string;
  slug?: string;
  description?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  url?: string;
  image_url?: string | null;
  tags?: string[];
}

export interface CoursesResponse {
  status: string;
  count: number;
  data: Course[];
}

export interface SingleCourseResponse {
  status: string;
  message?: string;
  data: Course;
}

export interface QuestionOption {
  id: number;
  question_id: number;
  text: string;
  value: string;
  weight?: Record<string, number>;
  order: number;
}

export type QuestionType = 'single_choice' | 'multiple_choice';

export interface Question {
  id: number;
  text: string;
  category: string;
  type: QuestionType;
  order: number;
  options: QuestionOption[];
}

export interface AssessmentQuestionsResponse {
  status: string;
  count: number;
  data: Question[];
}

export interface GenerateRecommendationPayload {
  options?: (number | string)[];
  answers?: Record<string, any>;
}

export interface CourseRecommendation {
  step: number;
  id: number;
  title: string;
  slug: string;
  description: string;
  level: string;
  duration: string;
  url: string;
  image_url?: string;
  tags: string[];
  reason: string;
}

export interface LearningPathRecommendation {
  title: string;
  description: string;
  level: string;
  estimated_duration: string;
  total_courses: number;
  target_areas: string[];
  courses: CourseRecommendation[];
}

export interface RecommendationResponse {
  status: string;
  data: LearningPathRecommendation;
}

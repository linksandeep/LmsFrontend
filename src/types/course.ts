export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail?: string;
  teacher: {
    id: string;
    name: string;
    email: string;
    avatar?: string; // Add avatar
  };
  category: {
    id: string;
    name: string;
  };
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  isPublished: boolean;
  totalLessons: number;
  totalDuration: number;
  averageRating: number;
  enrolledStudents: number;
  createdAt: string;
  updatedAt?: string; // Add updatedAt
  requirements?: string[];
  objectives?: string[];
  tags?: string[];
}

export interface CreateCourseData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  price?: number;
  requirements?: string[];
  objectives?: string[];
  tags?: string[];
}

export interface CourseFilters {
  category?: string;
  level?: string;
  search?: string;
  price?: 'free' | 'paid';
  page?: number;
  limit?: number;
}

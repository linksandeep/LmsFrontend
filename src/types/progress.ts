export interface CourseProgress {
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLessons: string[];
  totalLessons: number;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'dropped';
  certificateUrl?: string;
}

export interface LessonProgress {
  lessonId: string;
  lessonTitle: string;
  completed: boolean;
  lastWatchedPosition?: number; // seconds
  completedAt?: string;
}

export interface StudentStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessonsWatched: number;
  totalWatchTime: number; // minutes
  certificatesEarned: number;
}

export interface ContinueLearningItem {
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  nextLessonId: string;
  nextLessonTitle: string;
  progress: number;
  lastAccessedAt: string;
}

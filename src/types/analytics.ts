export interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  averageProgress: number;
  totalLessons: number;
  averageRating: number;
  totalRevenue: number;
  enrollmentTrend: Array<{
    date: string;
    count: number;
  }>;
  lessonEngagement: Array<{
    lessonId: string;
    lessonTitle: string;
    views: number;
    completions: number;
    averageWatchTime: number;
  }>;
}

export interface TeacherAnalytics {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  popularCourses: Array<{
    courseId: string;
    courseTitle: string;
    students: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'enrollment' | 'completion' | 'review';
    courseId: string;
    courseTitle: string;
    studentName: string;
    timestamp: string;
  }>;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrolledAt: string;
  lastActive: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  status: 'active' | 'completed' | 'inactive';
}

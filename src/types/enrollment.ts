export interface Enrollment {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    thumbnail?: string;
  };
  enrolledAt: string;
  status: 'active' | 'completed' | 'dropped';
  progress: number;
  completedLessons: string[];
  lastAccessedAt: string;
  completedAt?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
}

export interface EnrollmentStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageProgress: number;
}

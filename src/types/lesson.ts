export interface Lesson {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  duration: number;
  videoUrl?: string;
  videoProvider?: 'youtube' | 'vimeo' | 'custom';
  resources?: Array<{
    title: string;
    fileUrl: string;
    fileType: string;
  }>;
  isPreview: boolean;
  createdAt: string;
}

export interface CreateLessonData {
  title: string;
  description: string;
  order?: number;
  duration?: number;
  videoUrl?: string;
  videoProvider?: 'youtube' | 'vimeo' | 'custom';
  resources?: Array<{
    title: string;
    fileUrl: string;
    fileType: string;
  }>;
  isPreview?: boolean;
}

// For the LessonForm component
export interface LessonFormData {
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  videoProvider: 'youtube' | 'vimeo' | 'custom';
  isPreview: boolean;
  resources: Array<{ title: string; url: string }>;
}

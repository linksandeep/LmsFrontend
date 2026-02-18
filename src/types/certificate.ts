export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  certificateNumber: string;
  downloadUrl?: string;
  previewUrl?: string;
  isVerified: boolean;
}

export interface CertificateData {
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  certificateId: string;
  duration: string;
  grade?: string;
}

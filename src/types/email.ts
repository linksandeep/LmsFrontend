export interface EmailPreferences {
  marketing: boolean;
  courseUpdates: boolean;
  newLessons: boolean;
  achievements: boolean;
  weeklyDigest: boolean;
  discussionReplies: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'enrollment' | 'completion' | 'certificate' | 'reminder' | 'promotion';
  isActive: boolean;
}

export interface EmailHistory {
  id: string;
  type: string;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  openedAt?: string;
  clickedAt?: string;
}

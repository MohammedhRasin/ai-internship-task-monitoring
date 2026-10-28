export type UserRole = 'mentor' | 'intern';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  completedTasksCount: number;
  currentWeek: number;
  createdAt?: string;
}

export interface TaskItem {
  id: string;
  weekNumber: number;
  monthNumber: number;
  skill: string;
  title: string;
  description: string;
  deliverableRequirements: string;
  evaluationRubric: string;
  isFinalProject?: boolean;
}

export type SubmissionStatus = 'submitted' | 'evaluating' | 'needs_revision' | 'approved';

export interface Submission {
  id: string;
  taskId: string;
  taskWeek: number;
  internId: string;
  internName: string;
  internEmail: string;
  iterationNumber: number;
  submissionText: string;
  fileNames?: string;
  deliverableUrl?: string;
  status: SubmissionStatus;
  score?: number;
  strengths?: string;
  missingGaps?: string;
  improvements?: string;
  mentorNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface ReviewSchedule {
  id: string;
  internId: string;
  internName: string;
  internEmail: string;
  taskId: string;
  taskTitle: string;
  scheduledTime: string;
  meetingLink: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  recipientEmail: string;
  type: 'review_scheduled' | 'feedback_ready' | 'task_assigned' | 'task_approved';
  subject: string;
  body: string;
  sentAt: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  taskWeek?: number;
  createdAt: string;
}

export interface PlatformFeedback {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type RoleId = 1 | 3;

export interface Role {
  role: RoleId;
  rolename: string;
}

export interface User {
  id: number;
  email_id: string;
  fullname: string;
  phone: string;
  role: RoleId;
  status: number;
}

export interface Category {
  category_id: number;
  category_name: string;
}

export interface Course {
  course_id: number;
  course_name: string;
  description: string;
  duration_hours: number;
  category_id: number;
  category_name?: string;
  total_modules?: number;
  created_by: number | null;
  status: number;
}

export interface CourseModule {
  moduleId: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
  resources?: string;
  assignmentTitle: string;
  assignmentDescription: string;
  submissionRequired: boolean;
}

export interface ModuleSubmission {
  submissionId: number;
  moduleId: number;
  courseId: number;
  userId: number;
  filePath: string;
  status: 'NOT_STARTED' | 'SUBMITTED' | 'REVIEWED';
  submittedAt: string;
  reviewedAt?: string;
  scoreOutOf10?: number;
  aiFeedback?: string;
  strengths?: string;
  improvements?: string;
  completionPercentage?: number;
}

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Progress {
  progress_id: number;
  user_id: number;
  course_id: number;
  status: ProgressStatus;
  completion_pct: number;
  score: number;
  last_updated: string;
  course?: Course;
  course_name?: string;
  completed_modules?: number;
  total_modules?: number;
}

export interface MenuItem {
  mid: number;
  menu: string;
  icon: string;
}

export interface RolesMapping {
  mid: number;
  role: RoleId;
}

export interface AuthSession {
  user: User;
  token: string;
}

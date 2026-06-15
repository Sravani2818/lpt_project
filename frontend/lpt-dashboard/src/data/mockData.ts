import type { Category, Course, MenuItem, Progress, Role, RolesMapping, User } from '../types';

export const roles: Role[] = [
  { role: 1, rolename: 'Learner' },
  { role: 3, rolename: 'Admin' },
];

export const menuItems: MenuItem[] = [
  { mid: 1, icon: 'dashboard', menu: 'Dashboard' },
  { mid: 2, icon: 'book-open', menu: 'My Courses' },
  { mid: 3, icon: 'trending-up', menu: 'My Progress' },
  { mid: 4, icon: 'layers', menu: 'Course Manager' },
  { mid: 5, icon: 'users', menu: 'User Manager' },
  { mid: 6, icon: 'bar-chart-3', menu: 'Reports' },
  { mid: 7, icon: 'user-circle', menu: 'My Profile' },
];

export const rolesMapping: RolesMapping[] = [
  { mid: 1, role: 1 }, { mid: 2, role: 1 }, { mid: 3, role: 1 }, { mid: 7, role: 1 },
  { mid: 1, role: 3 }, { mid: 2, role: 3 }, { mid: 3, role: 3 }, { mid: 4, role: 3 }, { mid: 5, role: 3 }, { mid: 6, role: 3 }, { mid: 7, role: 3 },
];

export const categories: Category[] = [
  { category_id: 1, category_name: 'Python' },
  { category_id: 2, category_name: 'Data Science' },
  { category_id: 3, category_name: 'Web Development' },
  { category_id: 4, category_name: 'Java' },
  { category_id: 5, category_name: 'Artificial Intelligence' },
  { category_id: 6, category_name: 'Cloud Computing' },
];

export const courses: Course[] = [
  { course_id: 1, course_name: 'Python Basics', description: 'Learn Python from scratch', duration_hours: 20, category_id: 1, created_by: null, status: 1 },
  { course_id: 2, course_name: 'Java Spring Boot', description: 'Build REST APIs with Spring Boot', duration_hours: 30, category_id: 4, created_by: null, status: 1 },
  { course_id: 3, course_name: 'Machine Learning', description: 'Intro to ML algorithms', duration_hours: 40, category_id: 2, created_by: null, status: 1 },
  { course_id: 4, course_name: 'Cloud with AWS', description: 'AWS fundamentals and services', duration_hours: 25, category_id: 6, created_by: null, status: 1 },
  { course_id: 5, course_name: 'React Frontend', description: 'Build modern UIs with React', duration_hours: 20, category_id: 3, created_by: null, status: 1 },
];

export const users: User[] = [
  { id: 1, email_id: 'admin@lpt.com', fullname: 'Admin User', phone: '9999999999', role: 3, status: 1 },
  { id: 2, email_id: 'learner@lpt.com', fullname: 'Priya Sharma', phone: '9876543210', role: 1, status: 1 },
  { id: 4, email_id: 'alex@lpt.com', fullname: 'Alex Kumar', phone: '9988776655', role: 1, status: 1 },
];

export const progressRecords: Progress[] = [
  { progress_id: 1, user_id: 2, course_id: 1, status: 'COMPLETED', completion_pct: 100, score: 92, last_updated: '2026-05-20T14:30:00' },
  { progress_id: 2, user_id: 2, course_id: 3, status: 'IN_PROGRESS', completion_pct: 65, score: 78, last_updated: '2026-05-24T09:15:00' },
  { progress_id: 3, user_id: 2, course_id: 5, status: 'IN_PROGRESS', completion_pct: 40, score: 71, last_updated: '2026-05-23T18:45:00' },
  { progress_id: 4, user_id: 2, course_id: 4, status: 'NOT_STARTED', completion_pct: 0, score: 0, last_updated: '2026-05-18T10:00:00' },
  { progress_id: 5, user_id: 4, course_id: 1, status: 'IN_PROGRESS', completion_pct: 55, score: 68, last_updated: '2026-05-22T11:20:00' },
  { progress_id: 6, user_id: 4, course_id: 2, status: 'NOT_STARTED', completion_pct: 0, score: 0, last_updated: '2026-05-19T08:00:00' },
  { progress_id: 7, user_id: 4, course_id: 5, status: 'COMPLETED', completion_pct: 100, score: 88, last_updated: '2026-05-21T16:00:00' },
];

export const demoCredentials = [
  { email: 'admin@lpt.com', password: 'admin123', label: 'Admin' },
  { email: 'learner@lpt.com', password: 'learner123', label: 'Learner' },
];

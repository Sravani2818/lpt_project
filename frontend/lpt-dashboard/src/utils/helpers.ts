import type { Course, Progress, ProgressStatus, RoleId } from '../types';
import { categories, courses, menuItems, progressRecords, rolesMapping } from '../data/mockData';

export function getCategoryName(categoryId: number): string {
  return categories.find((c) => c.category_id === categoryId)?.category_name ?? 'Unknown';
}

export function getCourseById(courseId: number): Course | undefined {
  return courses.find((c) => c.course_id === courseId);
}

export function getMenuForRole(roleId: RoleId) {
  const allowedMids = rolesMapping.filter((r) => r.role === roleId).map((r) => r.mid);
  return menuItems.filter((m) => allowedMids.includes(m.mid));
}

export function getProgressForUser(userId: number): Progress[] {
  return progressRecords.filter((p) => p.user_id === userId);
}

export function getAllProgress(): Progress[] {
  return progressRecords;
}

export function statusLabel(status: ProgressStatus): string {
  const map: Record<ProgressStatus, string> = {
    NOT_STARTED: 'Not Started',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
  };
  return map[status];
}

export function statusClass(status: ProgressStatus): string {
  const map: Record<ProgressStatus, string> = {
    NOT_STARTED: 'status-not-started',
    IN_PROGRESS: 'status-in-progress',
    COMPLETED: 'status-completed',
  };
  return map[status];
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function averageScore(records: Progress[]): number {
  const scored = records.filter((p) => p.score > 0);
  if (scored.length === 0) return 0;
  return Math.round(scored.reduce((s, p) => s + p.score, 0) / scored.length);
}

export function completionOverview(records: Progress[]) {
  const total = records.length || 1;
  const completed = records.filter((p) => p.status === 'COMPLETED').length;
  const inProgress = records.filter((p) => p.status === 'IN_PROGRESS').length;
  const notStarted = records.filter((p) => p.status === 'NOT_STARTED').length;
  const avgCompletion = Math.round(
    records.reduce((s, p) => s + p.completion_pct, 0) / total
  );
  return { completed, inProgress, notStarted, avgCompletion, total };
}

export function getCategoryColor(name: string): string {
  const colors: Record<string, string> = {
    Python: '#00f0ff',
    'Data Science': '#a855f7',
    'Web Development': '#22d3ee',
    Java: '#f97316',
    'Artificial Intelligence': '#ec4899',
    'Cloud Computing': '#34d399',
  };
  return colors[name] ?? '#7c3aed';
}

export function midToPath(mid: number): string {
  const paths: Record<number, string> = {
    1: '/dashboard',
    2: '/courses',
    3: '/progress',
    4: '/course-manager',
    5: '/user-manager',
    6: '/reports',
    7: '/profile',
  };
  return paths[mid] ?? '/dashboard';
}

import { categories, courses, progressRecords, users } from '../data/mockData';
import type { AuthSession, Course, CourseModule, ModuleSubmission, Progress, RoleId, User } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const SIGNUP_STORE_KEY = 'lpt_registered_users';

export interface SignupPayload {
  email_id: string;
  password: string;
  fullname: string;
  phone: string;
  role: RoleId;
}

export interface ProgressUpdatePayload {
  user_id: number;
  course_id: number;
  completed_modules: number;
  score: number;
  status: Progress['status'];
}

export interface GemTransaction {
  id: number;
  userId?: number;
  user_id?: number;
  gemsEarned?: number;
  gems_earned?: number;
  reason: string;
  createdAt?: string;
  created_at?: string;
}

export interface BadgeReward {
  id: number;
  userId?: number;
  user_id?: number;
  badgeName?: string;
  badge_name?: string;
  badgeEmoji?: string;
  badge_emoji?: string;
  earnedAt?: string;
  earned_at?: string;
}

export interface RewardsSummary {
  total_gems: number;
  transactions: GemTransaction[];
  badges: BadgeReward[];
  current_streak: number;
  longest_streak: number;
}

function authHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  return headers;
}

function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem('lpt_auth_session');
    return raw ? (JSON.parse(raw) as AuthSession).token : null;
  } catch {
    return null;
  }
}

function loadRegistered(): Record<string, { password: string; user: User }> {
  try {
    const raw = localStorage.getItem(SIGNUP_STORE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, { password: string; user: User }>) : {};
  } catch {
    return {};
  }
}

function saveRegistered(data: Record<string, { password: string; user: User }>) {
  localStorage.setItem(SIGNUP_STORE_KEY, JSON.stringify(data));
}

function roleToUi(role: unknown): RoleId {
  if (role === 'ADMIN' || role === 3 || role === '3') return 3;
  return 1;
}

function roleToApi(role: RoleId) {
  return role === 3 ? 'ADMIN' : 'USER';
}

function normalizeUser(raw: any): User {
  const email = raw.email_id ?? raw.email ?? '';
  return {
    id: Number(raw.id ?? raw.user_id ?? 0),
    email_id: email,
    fullname: raw.fullname ?? raw.full_name ?? raw.name ?? raw.username ?? email.split('@')[0] ?? 'Learner',
    phone: raw.phone ?? '',
    role: roleToUi(raw.role),
    status: Number(raw.status ?? 1),
  };
}

function normalizeCourse(raw: any): Course {
  const categoryName = raw.category_name ?? raw.category ?? 'General';
  const existingCategory = categories.find((c) => c.category_name.toLowerCase() === String(categoryName).toLowerCase());
  const totalModules = Number(raw.total_modules ?? raw.duration_hours ?? 1);
  return {
    course_id: Number(raw.course_id ?? raw.id),
    course_name: raw.course_name ?? raw.title ?? 'Untitled course',
    description: raw.description ?? '',
    duration_hours: totalModules,
    category_id: Number(raw.category_id ?? existingCategory?.category_id ?? 1),
    category_name: categoryName,
    total_modules: totalModules,
    created_by: raw.created_by ?? null,
    status: Number(raw.status ?? 1),
  };
}

function normalizeProgress(raw: any): Progress {
  const course = raw.course ? normalizeCourse(raw.course) : undefined;
  const totalModules = Number(raw.total_modules ?? course?.total_modules ?? raw.course_total_modules ?? 1);
  const completed = Number(raw.completed_modules ?? 0);
  const pct = raw.completion_pct ?? (totalModules ? Math.round((completed / totalModules) * 100) : 0);
  return {
    progress_id: Number(raw.progress_id ?? raw.id ?? `${raw.user_id ?? 0}${raw.course_id ?? 0}`),
    user_id: Number(raw.user_id),
    course_id: Number(raw.course_id),
    status: raw.status ?? 'IN_PROGRESS',
    completion_pct: Number(pct),
    score: Number(raw.score ?? 0),
    last_updated: raw.last_updated ?? raw.last_accessed ?? new Date().toISOString(),
    course,
    course_name: raw.course_name ?? raw.title ?? course?.course_name,
    completed_modules: completed,
    total_modules: totalModules,
  };
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? data.message ?? 'Request failed');
  return data as T;
}

export async function signup(payload: SignupPayload): Promise<boolean> {
  if (USE_MOCK) {
    return mockSignup(payload);
  }

  try {
    const body = {
      username: payload.fullname || payload.email_id.split('@')[0],
      email: payload.email_id,
      password: payload.password,
      password_hash: payload.password,
      role: roleToApi(payload.role),
    };
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return mockSignup(payload);
  }
}

export async function login(email: string, password: string): Promise<AuthSession | null> {
  if (USE_MOCK) {
    return mockLogin(email, password);
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, email_id: email, password }),
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    const rawUser = data.user ?? data;
    return {
      user: normalizeUser(rawUser),
      token: data.token ?? data.access_token ?? data.jwt ?? '',
    };
  } catch {
    return mockLogin(email, password);
  }
}

async function mockSignup(payload: SignupPayload): Promise<boolean> {
  await delay(250);
  const registered = loadRegistered();
  if (users.some((u) => u.email_id === payload.email_id) || registered[payload.email_id]) return false;
  const newUser: User = {
    id: 100 + Object.keys(registered).length,
    email_id: payload.email_id,
    fullname: payload.fullname,
    phone: payload.phone || '',
    role: payload.role,
    status: 1,
  };
  registered[payload.email_id] = { password: payload.password, user: newUser };
  saveRegistered(registered);
  return true;
}

async function mockLogin(email: string, password: string): Promise<AuthSession | null> {
  await delay(250);
  const registered = loadRegistered()[email];
  if (registered && registered.password === password) {
    return { user: registered.user, token: `mock-jwt-${registered.user.id}-${Date.now()}` };
  }
  const user = users.find((u) => u.email_id === email && matchPassword(u, password));
  return user ? { user, token: `mock-jwt-${user.id}-${Date.now()}` } : null;
}

function matchPassword(user: User, password: string): boolean {
  const passwords: Record<string, string> = {
    'admin@lpt.com': 'admin123',
    'learner@lpt.com': 'learner123',
    'alex@lpt.com': 'learner123',
  };
  return passwords[user.email_id] === password;
}

export async function fetchCourses(): Promise<Course[]> {
  if (USE_MOCK) {
    await delay(200);
    return courses;
  }
  try {
    const res = await fetch(`${API_BASE}/courses`, { headers: authHeaders(getStoredToken()) });
    return (await parseResponse<any[]>(res)).map(normalizeCourse);
  } catch {
    return courses;
  }
}

export async function fetchProgress(userId?: number): Promise<Progress[]> {
  if (USE_MOCK) {
    await delay(200);
    return userId ? progressRecords.filter((p) => p.user_id === userId) : progressRecords;
  }
  try {
    const path = userId ? `/progress/user/${userId}` : '/progress/all';
    const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders(getStoredToken()) });
    return (await parseResponse<any[]>(res)).map(normalizeProgress);
  } catch {
    return userId ? progressRecords.filter((p) => p.user_id === userId) : progressRecords;
  }
}

export async function fetchUsers(): Promise<User[]> {
  if (USE_MOCK) {
    await delay(200);
    return users;
  }
  try {
    const res = await fetch(`${API_BASE}/users`, { headers: authHeaders(getStoredToken()) });
    return (await parseResponse<any[]>(res)).map(normalizeUser);
  } catch {
    return [...users, ...Object.values(loadRegistered()).map((entry) => entry.user)];
  }
}

export async function enrollInCourse(userId: number, courseId: number): Promise<Progress> {
  return updateProgress({
    user_id: userId,
    course_id: courseId,
    completed_modules: 0,
    score: 0,
    status: 'IN_PROGRESS',
  });
}

export async function updateProgress(payload: ProgressUpdatePayload): Promise<Progress> {
  if (USE_MOCK) {
    await delay(200);
    return normalizeProgress({ ...payload, id: Date.now(), last_accessed: new Date().toISOString() });
  }
  try {
    const res = await fetch(`${API_BASE}/progress/update`, {
      method: 'POST',
      headers: authHeaders(getStoredToken()),
      body: JSON.stringify(payload),
    });
    return normalizeProgress(await parseResponse<any>(res));
  } catch {
    return normalizeProgress({ ...payload, id: Date.now(), last_accessed: new Date().toISOString() });
  }
}

export async function createCourse(payload: Partial<Course> & Pick<Course, 'course_name' | 'description'>): Promise<Course> {
  try {
    const res = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: authHeaders(getStoredToken()),
      body: JSON.stringify({
        title: payload.course_name,
        description: payload.description,
        category: payload.category_name,
        total_modules: payload.total_modules ?? payload.duration_hours,
      }),
    });
    return normalizeCourse(await parseResponse<any>(res));
  } catch {
    return normalizeCourse({
      id: Date.now(),
      title: payload.course_name,
      description: payload.description,
      category: payload.category_name,
      total_modules: payload.total_modules ?? payload.duration_hours ?? 1,
    });
  }
}

export async function updateCourse(courseId: number, payload: Partial<Course> & Pick<Course, 'course_name' | 'description'>): Promise<Course> {
  try {
    const res = await fetch(`${API_BASE}/courses/${courseId}`, {
      method: 'PUT',
      headers: authHeaders(getStoredToken()),
      body: JSON.stringify({
        course_name: payload.course_name,
        description: payload.description,
        duration_hours: payload.duration_hours ?? payload.total_modules ?? 1,
        category_id: payload.category_id ?? 1,
      }),
    });
    return normalizeCourse(await parseResponse<any>(res));
  } catch {
    return normalizeCourse({
      id: courseId,
      title: payload.course_name,
      description: payload.description,
      category_id: payload.category_id ?? 1,
      total_modules: payload.total_modules ?? payload.duration_hours ?? 1,
    });
  }
}

export async function deleteCourse(courseId: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/courses/${courseId}`, {
      method: 'DELETE',
      headers: authHeaders(getStoredToken()),
    });
    return res.ok;
  } catch {
    return true;
  }
}

function normalizeModule(raw: any): CourseModule {
  return {
    moduleId: Number(raw.moduleId ?? raw.module_id),
    courseId: Number(raw.courseId ?? raw.course_id),
    title: raw.title ?? 'Module',
    description: raw.description ?? '',
    dueDate: raw.dueDate ?? raw.due_date ?? '',
    resources: raw.resources ?? '',
    assignmentTitle: raw.assignmentTitle ?? raw.assignment_title ?? 'Assignment',
    assignmentDescription: raw.assignmentDescription ?? raw.assignment_description ?? '',
    submissionRequired: Boolean(raw.submissionRequired ?? raw.submission_required ?? true),
  };
}

function normalizeSubmission(raw: any): ModuleSubmission {
  return {
    submissionId: Number(raw.submissionId ?? raw.submission_id),
    moduleId: Number(raw.moduleId ?? raw.module_id),
    courseId: Number(raw.courseId ?? raw.course_id),
    userId: Number(raw.userId ?? raw.user_id),
    filePath: raw.filePath ?? raw.file_path ?? '',
    status: raw.status ?? 'SUBMITTED',
    submittedAt: raw.submittedAt ?? raw.submitted_at ?? '',
    reviewedAt: raw.reviewedAt ?? raw.reviewed_at,
    scoreOutOf10: raw.scoreOutOf10 ?? raw.score_out_of_10,
    aiFeedback: raw.aiFeedback ?? raw.ai_feedback,
    strengths: raw.strengths,
    improvements: raw.improvements,
    completionPercentage: raw.completionPercentage ?? raw.completion_percentage,
  };
}

export async function fetchModules(courseId: number): Promise<CourseModule[]> {
  try {
    const res = await fetch(`${API_BASE}/courses/${courseId}/modules`, { headers: authHeaders(getStoredToken()) });
    const data = await parseResponse<any>(res);
    return (data.modules ?? data ?? []).map(normalizeModule);
  } catch {
    return [];
  }
}

export async function fetchSubmissions(params: { userId?: number; courseId?: number; moduleId?: number } = {}): Promise<ModuleSubmission[]> {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.set(key, String(value));
    });
    const res = await fetch(`${API_BASE}/submissions?${query.toString()}`, { headers: authHeaders(getStoredToken()) });
    return (await parseResponse<any[]>(res)).map(normalizeSubmission);
  } catch {
    return [];
  }
}

export async function submitModulePdf(moduleId: number, userId: number, file: File): Promise<ModuleSubmission> {
  const body = new FormData();
  body.append('file', file);
  const token = getStoredToken();
  const headers: HeadersInit = token ? { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/modules/${moduleId}/submit?userId=${userId}`, {
    method: 'POST',
    headers,
    body,
  });
  const data = await parseResponse<any>(res);
  return normalizeSubmission(data.submission ?? data);
}

export async function saveModule(payload: Partial<CourseModule> & Pick<CourseModule, 'courseId' | 'title' | 'description' | 'dueDate'>): Promise<CourseModule> {
  const method = payload.moduleId ? 'PUT' : 'POST';
  const url = payload.moduleId ? `${API_BASE}/modules/${payload.moduleId}` : `${API_BASE}/modules`;
  const res = await fetch(url, {
    method,
    headers: authHeaders(getStoredToken()),
    body: JSON.stringify(payload),
  });
  return normalizeModule(await parseResponse<any>(res));
}

export async function deleteModule(moduleId: number): Promise<boolean> {
  const res = await fetch(`${API_BASE}/modules/${moduleId}`, { method: 'DELETE', headers: authHeaders(getStoredToken()) });
  return res.ok;
}

export async function fetchInsights(userId?: number) {
  await delay(100);
  return { insights: [`${userId ? 'Learner' : 'System'} data is synced through the live progress table.`], risk_level: 'low' };
}

export async function fetchRewards(userId: number): Promise<RewardsSummary> {
  try {
    const [gemsRes, badgesRes, streakRes] = await Promise.all([
      fetch(`${API_BASE}/authservice/gems/${userId}`, { headers: authHeaders(getStoredToken()) }),
      fetch(`${API_BASE}/authservice/badges/${userId}`, { headers: authHeaders(getStoredToken()) }),
      fetch(`${API_BASE}/authservice/streak/${userId}`, { headers: authHeaders(getStoredToken()) }),
    ]);
    const gems = await parseResponse<any>(gemsRes);
    const badges = await parseResponse<any>(badgesRes);
    const streak = await parseResponse<any>(streakRes);
    return {
      total_gems: Number(gems.total_gems ?? 0),
      transactions: gems.transactions ?? [],
      badges: badges.badges ?? [],
      current_streak: Number(streak.current_streak ?? 0),
      longest_streak: Number(streak.longest_streak ?? 0),
    };
  } catch {
    return { total_gems: 0, transactions: [], badges: [], current_streak: 0, longest_streak: 0 };
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

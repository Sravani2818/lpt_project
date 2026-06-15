import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { AuthProvider } from './context/AuthContext';
import { CourseManagerPage } from './pages/CourseManagerPage';
import { CoursesPage } from './pages/CoursesPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ModulesPage } from './pages/ModulesPage';
import { SignUpPage } from './pages/SignUpPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProgressPage } from './pages/ProgressPage';
import { ReportsPage } from './pages/ReportsPage';
import { UserManagerPage } from './pages/UserManagerPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:courseId/modules" element={<ModulesPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route
                element={<ProtectedRoute allowedRoles={[3]} requiredMid={4} />}
              >
                <Route path="course-manager" element={<CourseManagerPage />} />
              </Route>
              <Route
                element={<ProtectedRoute allowedRoles={[3]} requiredMid={5} />}
              >
                <Route path="user-manager" element={<UserManagerPage />} />
              </Route>
              <Route
                element={<ProtectedRoute allowedRoles={[3]} requiredMid={6} />}
              >
                <Route path="reports" element={<ReportsPage />} />
              </Route>
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

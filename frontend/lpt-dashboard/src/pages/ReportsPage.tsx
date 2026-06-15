import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, GraduationCap, Users } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatCard } from '../components/ui/StatCard';
import { fetchCourses, fetchProgress, fetchUsers } from '../services/api';
import type { Course, Progress, User } from '../types';
import { statusLabel } from '../utils/helpers';

export function ReportsPage() {
  const [progressRecords, setProgressRecords] = useState<Progress[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    Promise.all([fetchProgress(), fetchUsers(), fetchCourses()]).then(([progress, loadedUsers, loadedCourses]) => {
      setProgressRecords(progress);
      setUsers(loadedUsers);
      setCourses(loadedCourses);
    });
  }, []);

  const courseName = (id: number) => courses.find((c) => c.course_id === id)?.course_name ?? `Course ${id}`;

  const chartData = useMemo(() => {
    const byCourse = progressRecords.reduce<Record<number, { completions: number; totalScore: number; count: number }>>((acc, p) => {
      if (!acc[p.course_id]) acc[p.course_id] = { completions: 0, totalScore: 0, count: 0 };
      if (p.status === 'COMPLETED') acc[p.course_id].completions += 1;
      if (p.score > 0) {
        acc[p.course_id].totalScore += p.score;
        acc[p.course_id].count += 1;
      }
      return acc;
    }, {});

    return Object.entries(byCourse).map(([courseId, stats]) => ({
      name: courseName(Number(courseId)).slice(0, 14),
      completions: stats.completions,
      avgScore: stats.count ? Math.round(stats.totalScore / stats.count) : 0,
    }));
  }, [progressRecords, courses]);

  const statusBreakdown = ['COMPLETED', 'IN_PROGRESS', 'NOT_STARTED'].map((s) => ({
    status: statusLabel(s as Progress['status']),
    count: progressRecords.filter((p) => p.status === s).length,
  }));

  return (
    <div className="page reports-page">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Analytics</p>
          <h1>Reports</h1>
          <p className="page-header__meta">System-wide learning analytics</p>
        </div>
      </header>

      <div className="stat-grid">
        <StatCard label="Total users" value={users.length} icon={Users} accent="cyan" />
        <StatCard label="Progress records" value={progressRecords.length} icon={BarChart3} accent="purple" />
        <StatCard
          label="Completions"
          value={progressRecords.filter((p) => p.status === 'COMPLETED').length}
          icon={GraduationCap}
          accent="green"
        />
      </div>

      <div className="dashboard-grid">
        <GlassCard title="Completions & scores by course" className="span-8">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Bar dataKey="completions" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgScore" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Status breakdown" className="span-4">
          <ul className="report-list">
            {statusBreakdown.map((row) => (
              <li key={row.status}>
                <span>{row.status}</span>
                <strong>{row.count}</strong>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

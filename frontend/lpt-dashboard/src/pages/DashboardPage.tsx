import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GemsPanel } from '../components/GemsPanel';
import { ProgressRing } from '../components/ui/ProgressRing';
import { StatCard } from '../components/ui/StatCard';
import { useAuth } from '../context/AuthContext';
import { fetchCourses, fetchProgress, fetchRewards, type RewardsSummary } from '../services/api';
import type { Course, Progress } from '../types';
import {
  averageScore,
  completionOverview,
  formatDate,
  getCourseById,
  statusClass,
  statusLabel,
} from '../utils/helpers';

export function DashboardPage() {
  const { user, roleName, isAdmin } = useAuth();
  const [records, setRecords] = useState<Progress[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rewards, setRewards] = useState<RewardsSummary>({
    total_gems: 0,
    transactions: [],
    badges: [],
    current_streak: 0,
    longest_streak: 0,
  });
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [rewardsLoading, setRewardsLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchProgress(isAdmin ? undefined : user?.id), fetchCourses()]).then(([progress, loadedCourses]) => {
      setRecords(progress);
      setCourses(loadedCourses);
    });
    if (user?.id) {
      setRewardsLoading(true);
      fetchRewards(user.id)
        .then(setRewards)
        .finally(() => setRewardsLoading(false));
    }
  }, [user, isAdmin]);

  const courseName = (id: number) => courses.find((c) => c.course_id === id)?.course_name ?? getCourseById(id)?.course_name ?? 'Course';
  const overview = completionOverview(records);
  const avgScore = averageScore(records);

  const pieData = [
    { name: 'Completed', value: overview.completed, fill: '#34d399' },
    { name: 'In Progress', value: overview.inProgress, fill: '#00f0ff' },
    { name: 'Not Started', value: overview.notStarted, fill: '#64748b' },
  ];

  const trendData = records
    .filter((p) => p.completion_pct > 0)
    .slice(0, 6)
    .map((p) => ({
      name: courseName(p.course_id).slice(0, 12),
      completion: p.completion_pct,
      score: p.score,
    }));

  const recent = [...records]
    .sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
    .slice(0, 5);

  return (
    <div className="page dashboard-page">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Welcome back</p>
          <h1>{user?.fullname}</h1>
          <div className="reward-strip">
            <span className="reward-pill">🔥 {rewards.current_streak} day streak</span>
            {rewards.current_streak >= 3 && <span className="reward-pill reward-pill--gold">🏆 Consistent Learner!</span>}
            {rewards.current_streak >= 7 && <span className="reward-pill reward-pill--purple">💪 Week Warrior!</span>}
            <button type="button" className="reward-pill reward-pill--button" onClick={() => setRewardsOpen(true)}>
              💎 {rewards.total_gems} gems
            </button>
          </div>
          <p className="page-header__meta">
            {roleName} · {overview.total} enrolled track{overview.total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="page-header__ring">
          <ProgressRing pct={overview.avgCompletion} label="Overall" />
        </div>
      </header>

      <div className="stat-grid">
        <StatCard
          label="Avg completion"
          value={`${overview.avgCompletion}%`}
          sub="Across all courses"
          icon={Target}
          accent="cyan"
        />
        <StatCard
          label="Completed"
          value={overview.completed}
          sub="Courses finished"
          icon={CheckCircle2}
          accent="green"
        />
        <StatCard
          label="In progress"
          value={overview.inProgress}
          sub="Active learning"
          icon={Clock}
          accent="purple"
        />
        <StatCard
          label="Avg score"
          value={avgScore ? `${avgScore}%` : '—'}
          sub="Performance index"
          icon={Award}
          accent="orange"
        />
      </div>

      <div className="dashboard-grid">
        <GlassCard title="Progress distribution" className="span-4">
          <div className="chart-wrap chart-wrap--pie">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid rgba(0,240,255,0.2)',
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <ul className="legend">
              {pieData.map((d) => (
                <li key={d.name}>
                  <span style={{ background: d.fill }} />
                  {d.name}: {d.value}
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>

        <GlassCard title="Performance trend" className="span-8">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData.length ? trendData : [{ name: '—', completion: 0, score: 0 }]}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid rgba(0,240,255,0.2)',
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completion"
                  stroke="#00f0ff"
                  fill="url(#cyanGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard
          title="Recent activity"
          className="span-12"
          action={<TrendingUp size={18} className="text-muted" />}
        >
          <div className="activity-list">
            {recent.map((p) => {
              return (
                <div key={p.progress_id} className="activity-item">
                  <div className="activity-item__icon">
                    <BookOpen size={16} />
                  </div>
                  <div className="activity-item__main">
                    <strong>{courseName(p.course_id)}</strong>
                    <span className={`badge ${statusClass(p.status)}`}>
                      {statusLabel(p.status)}
                    </span>
                  </div>
                  <div className="activity-item__stats">
                    <span>{p.completion_pct}% complete</span>
                    {p.score > 0 && <span>Score: {p.score}%</span>}
                  </div>
                  <time>{formatDate(p.last_updated)}</time>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
      <GemsPanel
        open={rewardsOpen}
        totalGems={rewards.total_gems}
        badges={rewards.badges}
        transactions={rewards.transactions}
        loading={rewardsLoading}
        onClose={() => setRewardsOpen(false)}
      />
    </div>
  );
}

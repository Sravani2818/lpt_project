import { Download, FileText, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useAuth } from '../context/AuthContext';
import { fetchCourses, fetchProgress, updateProgress } from '../services/api';
import type { Course, Progress } from '../types';
import {
  averageScore,
  completionOverview,
  formatDate,
  getCourseById,
  statusLabel,
} from '../utils/helpers';

export function ProgressPage() {
  const { user, isAdmin } = useAuth();
  const [records, setRecords] = useState<Progress[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [editing, setEditing] = useState<Record<number, { completed_modules: number; score: number; status: Progress['status'] }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      const [loadedCourses, loadedProgress] = await Promise.all([
        fetchCourses(),
        fetchProgress(isAdmin ? undefined : user?.id),
      ]);
      if (!alive) return;
      setCourses(loadedCourses);
      setRecords(loadedProgress);
      setLoading(false);
    }
    load();
    return () => {
      alive = false;
    };
  }, [user, isAdmin]);

  const overview = completionOverview(records);
  const avgScore = averageScore(records);

  const courseById = (id: number) =>
    courses.find((c) => c.course_id === id) ?? getCourseById(id) ?? records.find((p) => p.course_id === id)?.course;

  const reportRows = records.map((p) => {
    const c = courseById(p.course_id);
    return {
      course: c?.course_name ?? p.course_name ?? `Course ${p.course_id}`,
      status: statusLabel(p.status),
      completion: p.completion_pct,
      score: p.score,
      updated: formatDate(p.last_updated),
      modules: `${p.completed_modules ?? 0}/${p.total_modules ?? c?.total_modules ?? c?.duration_hours ?? 1}`,
    };
  });

  const summaryText = useMemo(() => {
    return [
      'Learning Progress Summary',
      `Generated: ${new Date().toLocaleString()}`,
      `Learner: ${isAdmin ? 'All learners' : user?.fullname}`,
      '---',
      `Total courses tracked: ${overview.total}`,
      `Average completion: ${overview.avgCompletion}%`,
      `Completed: ${overview.completed} | In Progress: ${overview.inProgress} | Not Started: ${overview.notStarted}`,
      `Average performance score: ${avgScore}%`,
      '---',
      ...reportRows.map((row) => `${row.course}: ${row.status} | ${row.completion}% | Score ${row.score}% | Modules ${row.modules}`),
    ].join('\n');
  }, [avgScore, isAdmin, overview, reportRows, user]);

  const generatePdf = () => {
    const rows = reportRows
      .map(
        (row) => `<tr><td>${row.course}</td><td>${row.status}</td><td>${row.modules}</td><td>${row.completion}%</td><td>${row.score}%</td><td>${row.updated}</td></tr>`
      )
      .join('');
    const popup = window.open('', '_blank', 'width=900,height=700');
    if (!popup) return;
    popup.document.write(`
      <html>
        <head>
          <title>LPT Progress Report</title>
          <style>
            body{font-family:Arial,sans-serif;color:#111827;margin:36px}
            h1{margin:0 0 4px;font-size:28px}
            .meta{color:#4b5563;margin-bottom:24px}
            .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}
            .card{border:1px solid #d1d5db;border-radius:8px;padding:12px}
            .card span{display:block;color:#6b7280;font-size:12px}.card strong{font-size:22px}
            table{width:100%;border-collapse:collapse;margin-top:18px}
            th,td{border:1px solid #d1d5db;padding:10px;text-align:left;font-size:12px}
            th{background:#f3f4f6}
          </style>
        </head>
        <body>
          <h1>Learn Track Progress Report</h1>
          <div class="meta">Generated ${new Date().toLocaleString()} for ${isAdmin ? 'all learners' : user?.fullname}</div>
          <div class="cards">
            <div class="card"><span>Tracked</span><strong>${overview.total}</strong></div>
            <div class="card"><span>Avg completion</span><strong>${overview.avgCompletion}%</strong></div>
            <div class="card"><span>Completed</span><strong>${overview.completed}</strong></div>
            <div class="card"><span>Avg score</span><strong>${avgScore}%</strong></div>
          </div>
          <table><thead><tr><th>Course</th><th>Status</th><th>Modules</th><th>Completion</th><th>Score</th><th>Last updated</th></tr></thead><tbody>${rows}</tbody></table>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  const saveRow = async (p: Progress) => {
    const draft = editing[p.progress_id];
    if (!draft) return;
    const saved = await updateProgress({
      user_id: p.user_id,
      course_id: p.course_id,
      completed_modules: draft.completed_modules,
      score: draft.score,
      status: draft.status,
    });
    setRecords((current) => current.map((row) => (row.progress_id === p.progress_id ? { ...row, ...saved } : row)));
    setEditing((current) => {
      const next = { ...current };
      delete next[p.progress_id];
      return next;
    });
  };

  return (
    <div className="page progress-page">
      <header className="page-header page-header--row">
        <div>
          <p className="page-header__eyebrow">Tracking</p>
          <h1>{isAdmin ? 'Learner Progress' : 'My Progress'}</h1>
          <p className="page-header__meta">{loading ? 'Loading progress...' : 'Status, completion and performance'}</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={generatePdf}>
          <Download size={18} />
          Generate report
        </button>
      </header>

      <div className="progress-overview-cards">
        <GlassCard title="Completion overview">
          <div className="overview-split">
            <ProgressRing pct={overview.avgCompletion} size={120} label="Average" />
            <ul className="overview-stats">
              <li><span className="dot dot--green" /> Completed: <strong>{overview.completed}</strong></li>
              <li><span className="dot dot--cyan" /> In progress: <strong>{overview.inProgress}</strong></li>
              <li><span className="dot dot--muted" /> Not started: <strong>{overview.notStarted}</strong></li>
              <li><span className="dot dot--orange" /> Avg score: <strong>{avgScore}%</strong></li>
            </ul>
          </div>
        </GlassCard>
        <GlassCard title="Progress summary preview">
          <pre className="summary-preview">{summaryText}</pre>
        </GlassCard>
      </div>

      <GlassCard title="Course progress details">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {isAdmin && <th>User ID</th>}
                <th>Course</th>
                <th>Status</th>
                <th>Modules</th>
                <th>Completion</th>
                <th>Score</th>
                <th>Last updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((p) => {
                const course = courseById(p.course_id);
                const totalModules = p.total_modules ?? course?.total_modules ?? course?.duration_hours ?? 1;
                const draft = editing[p.progress_id] ?? {
                  completed_modules: p.completed_modules ?? Math.round((p.completion_pct / 100) * totalModules),
                  score: p.score,
                  status: p.status,
                };
                const pct = Math.min(100, Math.round((draft.completed_modules / totalModules) * 100));
                return (
                  <tr key={p.progress_id}>
                    {isAdmin && <td>#{p.user_id}</td>}
                    <td>
                      <div className="table-course">
                        <FileText size={16} />
                        {course?.course_name ?? p.course_name ?? `Course ${p.course_id}`}
                      </div>
                    </td>
                    <td>
                      <select
                        value={draft.status}
                        onChange={(e) =>
                          setEditing((current) => ({ ...current, [p.progress_id]: { ...draft, status: e.target.value as Progress['status'] } }))
                        }
                      >
                        <option value="NOT_STARTED">Not started</option>
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="table-input"
                        type="number"
                        min={0}
                        max={totalModules}
                        value={draft.completed_modules}
                        onChange={(e) =>
                          setEditing((current) => ({ ...current, [p.progress_id]: { ...draft, completed_modules: Number(e.target.value) } }))
                        }
                      />
                      <span className="text-muted"> / {totalModules}</span>
                    </td>
                    <td>
                      <div className="progress-bar-cell">
                        <div className="progress-bar">
                          <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span>{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <input
                        className="table-input"
                        type="number"
                        min={0}
                        max={100}
                        value={draft.score}
                        onChange={(e) =>
                          setEditing((current) => ({ ...current, [p.progress_id]: { ...draft, score: Number(e.target.value) } }))
                        }
                      />
                    </td>
                    <td className="text-muted">{formatDate(p.last_updated)}</td>
                    <td>
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => saveRow(p)} disabled={!editing[p.progress_id]}>
                        <Save size={14} />
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

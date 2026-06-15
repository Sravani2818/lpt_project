import { Download, FileUp, Save, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { deleteModule, fetchCourses, fetchModules, fetchSubmissions, saveModule, submitModulePdf } from '../services/api';
import type { Course, CourseModule, ModuleSubmission } from '../types';
import { formatDate } from '../utils/helpers';

export function ModulesPage() {
  const { courseId = '0' } = useParams();
  const id = Number(courseId);
  const { user, isAdmin } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [submissions, setSubmissions] = useState<ModuleSubmission[]>([]);
  const [selected, setSelected] = useState<CourseModule | null>(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', dueDate: '', assignmentTitle: '', assignmentDescription: '' });

  useEffect(() => {
    Promise.all([
      fetchCourses(),
      fetchModules(id),
      fetchSubmissions(isAdmin ? { courseId: id } : { userId: user?.id, courseId: id }),
    ]).then(([courses, loadedModules, loadedSubmissions]) => {
      setCourse(courses.find((c) => c.course_id === id) ?? null);
      setModules(loadedModules);
      setSubmissions(loadedSubmissions);
      setSelected(loadedModules[0] ?? null);
    });
  }, [id, isAdmin, user]);

  const submittedModuleIds = useMemo(() => new Set(submissions.map((s) => s.moduleId)), [submissions]);
  const selectedSubmission = selected ? submissions.find((s) => s.moduleId === selected.moduleId) : undefined;

  const completed = submittedModuleIds.size;
  const pending = Math.max(0, modules.length - completed);

  const uploadPdf = async (file?: File) => {
    if (!file || !selected || !user) return;
    setMessage('');
    if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
      setMessage('Only PDF files are allowed.');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setMessage('PDF must be 100 MB or less.');
      return;
    }
    setUploading(true);
    try {
      const saved = await submitModulePdf(selected.moduleId, user.id, file);
      setSubmissions((current) => [saved, ...current.filter((s) => s.moduleId !== selected.moduleId)]);
      setMessage('PDF submitted. AI feedback and score generated.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const addModule = async () => {
    if (!moduleForm.title || !moduleForm.description || !moduleForm.dueDate) return;
    const saved = await saveModule({
      courseId: id,
      title: moduleForm.title,
      description: moduleForm.description,
      dueDate: moduleForm.dueDate,
      assignmentTitle: moduleForm.assignmentTitle || `${moduleForm.title} Assignment`,
      assignmentDescription: moduleForm.assignmentDescription || 'Submit your PDF assignment.',
      submissionRequired: true,
    });
    setModules((current) => [...current, saved]);
    setModuleForm({ title: '', description: '', dueDate: '', assignmentTitle: '', assignmentDescription: '' });
  };

  const removeModule = async (moduleId: number) => {
    if (!window.confirm('Delete this module?')) return;
    if (await deleteModule(moduleId)) {
      setModules((current) => current.filter((m) => m.moduleId !== moduleId));
      if (selected?.moduleId === moduleId) setSelected(null);
    }
  };

  return (
    <div className="page modules-page">
      <header className="page-header page-header--row">
        <div>
          <p className="page-header__eyebrow">Modules</p>
          <h1>{course?.course_name ?? 'Course modules'}</h1>
          <p className="page-header__meta">{completed}/{modules.length} submitted · {pending} pending assignments</p>
        </div>
        <Link to="/courses" className="btn btn--ghost">Back to courses</Link>
      </header>

      <div className="module-summary-grid">
        <GlassCard title="Total modules"><strong className="module-kpi">{modules.length}</strong></GlassCard>
        <GlassCard title="Completed modules"><strong className="module-kpi">{completed}</strong></GlassCard>
        <GlassCard title="Pending assignments"><strong className="module-kpi">{pending}</strong></GlassCard>
        <GlassCard title="Next due date"><strong className="module-kpi module-kpi--small">{modules.find((m) => !submittedModuleIds.has(m.moduleId))?.dueDate ?? 'Done'}</strong></GlassCard>
      </div>

      {isAdmin && (
        <GlassCard title="Create module" className="form-card">
          <div className="inline-form">
            <input placeholder="Module title" value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} />
            <input placeholder="Description" value={moduleForm.description} onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })} />
            <input type="date" value={moduleForm.dueDate} onChange={(e) => setModuleForm({ ...moduleForm, dueDate: e.target.value })} />
            <input placeholder="Assignment title" value={moduleForm.assignmentTitle} onChange={(e) => setModuleForm({ ...moduleForm, assignmentTitle: e.target.value })} />
            <button type="button" className="btn btn--primary" onClick={addModule}><Save size={16} /> Add module</button>
          </div>
        </GlassCard>
      )}

      <div className="modules-layout">
        <GlassCard title="Module list" className="span-4">
          <div className="module-list">
            {modules.map((module) => (
              <button key={module.moduleId} type="button" className={`module-row ${selected?.moduleId === module.moduleId ? 'module-row--active' : ''}`} onClick={() => setSelected(module)}>
                <span>{module.title}</span>
                <small className="due-badge">Due {module.dueDate}</small>
                <em className={`status-badge ${submittedModuleIds.has(module.moduleId) ? 'status-reviewed' : 'status-not-started'}`}>
                  {submittedModuleIds.has(module.moduleId) ? 'Submitted' : 'Not Started'}
                </em>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Module details" className="span-8">
          {selected ? (
            <div className="module-detail">
              <div className="module-detail__head">
                <div>
                  <h2>{selected.title}</h2>
                  <span className="due-badge">Due {selected.dueDate}</span>
                </div>
                {isAdmin && <button type="button" className="icon-btn icon-btn--danger" onClick={() => removeModule(selected.moduleId)}><Trash2 size={16} /></button>}
              </div>
              <p>{selected.description}</p>
              <h3>{selected.assignmentTitle}</h3>
              <p>{selected.assignmentDescription}</p>
              <p><strong>Submission status:</strong> {selectedSubmission?.status ?? 'Not Started'}</p>
              {selectedSubmission && (
                <div className="feedback-box">
                  <strong>Score: {selectedSubmission.scoreOutOf10 ?? 0}/10</strong>
                  <span>Completion: {selectedSubmission.completionPercentage ?? 0}%</span>
                  <p>{selectedSubmission.aiFeedback}</p>
                  <p><b>Strengths:</b> {selectedSubmission.strengths}</p>
                  <p><b>Improvements:</b> {selectedSubmission.improvements}</p>
                  <small>Submitted: {formatDate(selectedSubmission.submittedAt)}</small>
                  {isAdmin && <a className="btn btn--ghost btn--sm" href={`http://localhost:8081/api/submissions/${selectedSubmission.submissionId}/download`}><Download size={14} /> Download PDF</a>}
                </div>
              )}
              {!isAdmin && (
                <label className="upload-box">
                  <FileUp size={20} />
                  <span>Upload assignment PDF (max 100 MB)</span>
                  <input type="file" accept="application/pdf,.pdf" onChange={(e) => uploadPdf(e.target.files?.[0])} />
                </label>
              )}
              {uploading && <div className="upload-progress"><i /></div>}
              {message && <p className="inline-success">{message}</p>}
            </div>
          ) : <p className="text-muted">Select a module.</p>}
        </GlassCard>
      </div>
    </div>
  );
}

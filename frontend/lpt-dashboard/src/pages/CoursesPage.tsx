import { BookOpen, Clock, Filter, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/mockData';
import { createCourse, deleteCourse, enrollInCourse, fetchCourses, fetchProgress } from '../services/api';
import type { Course, Progress } from '../types';
import { getCategoryColor, getCategoryName } from '../utils/helpers';

export function CoursesPage() {
  const { user, isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all');
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [records, setRecords] = useState<Progress[]>([]);
  const [selected, setSelected] = useState<Course | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCourse, setNewCourse] = useState({ course_name: '', description: '', duration_hours: 10, category_id: 1 });

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      try {
        const [loadedCourses, loadedProgress] = await Promise.all([
          fetchCourses(),
          user ? fetchProgress(isAdmin ? undefined : user.id) : Promise.resolve([]),
        ]);
        if (!alive) return;
        setCourseList(loadedCourses);
        setRecords(loadedProgress);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [user, isAdmin]);

  const enrolledCourseIds = useMemo(
    () => new Set(records.filter((p) => p.user_id === user?.id).map((p) => p.course_id)),
    [records, user]
  );

  const filtered = useMemo(() => {
    return courseList.filter((c) => {
      const matchSearch =
        c.course_name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || c.category_id === categoryFilter;
      return matchSearch && matchCat && c.status === 1;
    });
  }, [courseList, search, categoryFilter]);

  const handleEnroll = async (course: Course) => {
    if (!user || enrolledCourseIds.has(course.course_id)) return;
    setMessage('');
    const created = await enrollInCourse(user.id, course.course_id);
    setRecords((current) => [...current, created]);
    setMessage(`Enrolled in ${course.course_name}. Admin can now see this in progress records.`);
  };

  const handleAddCourse = async () => {
    if (!newCourse.course_name || !newCourse.description) return;
    const created = await createCourse({
      ...newCourse,
      total_modules: newCourse.duration_hours,
      category_name: getCategoryName(newCourse.category_id),
    });
    setCourseList((current) => [...current, created]);
    setNewCourse({ course_name: '', description: '', duration_hours: 10, category_id: 1 });
    setShowAdd(false);
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('Delete this course?')) return;
    if (await deleteCourse(courseId)) {
      setCourseList((current) => current.filter((course) => course.course_id !== courseId));
    }
  };

  return (
    <div className="page courses-page">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Catalog</p>
          <h1>My Courses</h1>
          <p className="page-header__meta">
            {loading ? 'Loading courses...' : `${filtered.length} courses available`}
          </p>
        </div>
        {isAdmin && (
          <button type="button" className="btn btn--primary" onClick={() => setShowAdd((open) => !open)}>
            <Plus size={18} /> Add course
          </button>
        )}
      </header>

      {isAdmin && showAdd && (
        <div className="inline-form form-card">
          <input placeholder="Course name" value={newCourse.course_name} onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })} />
          <input placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} />
          <input type="number" min={1} value={newCourse.duration_hours} onChange={(e) => setNewCourse({ ...newCourse, duration_hours: Number(e.target.value) })} />
          <select value={newCourse.category_id} onChange={(e) => setNewCourse({ ...newCourse, category_id: Number(e.target.value) })}>
            {categories.map((c) => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
          </select>
          <button type="button" className="btn btn--primary" onClick={handleAddCourse}>Save</button>
        </div>
      )}

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          <Filter size={16} className="text-muted" />
          <button
            type="button"
            className={`chip ${categoryFilter === 'all' ? 'chip--active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              type="button"
              className={`chip ${categoryFilter === cat.category_id ? 'chip--active' : ''}`}
              onClick={() => setCategoryFilter(cat.category_id)}
            >
              {cat.category_name}
            </button>
          ))}
        </div>
      </div>

      {message && <p className="inline-success">{message}</p>}

      <div className="course-grid">
        {filtered.map((course) => {
          const catName = course.category_name ?? getCategoryName(course.category_id);
          const color = getCategoryColor(catName);
          const enrolled = enrolledCourseIds.has(course.course_id);
          return (
            <article key={course.course_id} className="course-card">
              <div
                className="course-card__accent"
                style={{ background: `linear-gradient(135deg, ${color}33, transparent)` }}
              />
              <span className="course-card__category" style={{ color, borderColor: `${color}44` }}>
                {catName}
              </span>
              <h3>{course.course_name}</h3>
              <p>{course.description}</p>
              <footer>
                <span>
                  <Clock size={14} />
                  {course.total_modules ?? course.duration_hours} modules
                </span>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSelected(course)}>
                  View details
                </button>
                <Link className="btn btn--ghost btn--sm" to={`/courses/${course.course_id}/modules`}>
                  Modules
                </Link>
                {isAdmin && (
                  <button type="button" className="icon-btn icon-btn--danger" onClick={() => handleDeleteCourse(course.course_id)} title="Delete course">
                    <Trash2 size={15} />
                  </button>
                )}
              </footer>
              {!isAdmin && (
                <button
                  type="button"
                  className={`btn btn--primary btn--block ${enrolled ? 'btn--disabled' : ''}`}
                  onClick={() => handleEnroll(course)}
                  disabled={enrolled}
                >
                  <BookOpen size={16} />
                  {enrolled ? 'Enrolled' : 'Enroll'}
                </button>
              )}
            </article>
          );
        })}
      </div>

      {selected && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <section className="detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="icon-btn detail-modal__close" onClick={() => setSelected(null)}>
              <X size={18} />
            </button>
            <p className="page-header__eyebrow">{selected.category_name ?? getCategoryName(selected.category_id)}</p>
            <h2>{selected.course_name}</h2>
            <p>{selected.description}</p>
            <div className="detail-grid">
              <span>Total modules</span>
              <strong>{selected.total_modules ?? selected.duration_hours}</strong>
              <span>Status</span>
              <strong>{enrolledCourseIds.has(selected.course_id) ? 'Enrolled' : 'Open'}</strong>
            </div>
            {!isAdmin && (
              <button
                type="button"
                className="btn btn--primary btn--block"
                onClick={() => handleEnroll(selected)}
                disabled={enrolledCourseIds.has(selected.course_id)}
              >
                {enrolledCourseIds.has(selected.course_id) ? 'Already enrolled' : 'Enroll in this course'}
              </button>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

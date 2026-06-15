import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { categories } from '../data/mockData';
import { createCourse, deleteCourse, fetchCourses, updateCourse } from '../services/api';
import type { Course } from '../types';
import { getCategoryName } from '../utils/helpers';

export function CourseManagerPage() {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    course_name: '',
    description: '',
    duration_hours: 20,
    category_id: 1,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCourses().then(setCourseList).catch(() => setCourseList([]));
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const category = categories.find((c) => c.category_id === form.category_id);
    const payload = {
      course_name: form.course_name,
      description: form.description,
      duration_hours: form.duration_hours,
      total_modules: form.duration_hours,
      category_id: form.category_id,
      category_name: category?.category_name ?? 'General',
      created_by: null,
      status: 1,
    };

    if (editingId) {
      const updatedCourse = await updateCourse(editingId, payload);
      setCourseList(courseList.map((course) => course.course_id === editingId ? updatedCourse : course));
    } else {
      const newCourse = await createCourse(payload);
      setCourseList([...courseList, newCourse]);
    }

    setForm({ course_name: '', description: '', duration_hours: 20, category_id: 1 });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (course: Course) => {
    setEditingId(course.course_id);
    setForm({
      course_name: course.course_name,
      description: course.description,
      duration_hours: course.duration_hours,
      category_id: course.category_id,
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId: number) => {
    const ok = window.confirm('Delete this course?');
    if (!ok) return;
    const deleted = await deleteCourse(courseId);
    if (deleted) {
      setCourseList(courseList.filter((course) => course.course_id !== courseId));
    }
  };

  const toggleStatus = (id: number) => {
    setCourseList(
      courseList.map((c) =>
        c.course_id === id ? { ...c, status: c.status === 1 ? 0 : 1 } : c
      )
    );
  };

  return (
    <div className="page manager-page">
      <header className="page-header page-header--row">
        <div>
          <p className="page-header__eyebrow">Admin</p>
          <h1>Course Manager</h1>
          <p className="page-header__meta">CRUD-ready UI — connects to Spring Boot API</p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            setEditingId(null);
            setForm({ course_name: '', description: '', duration_hours: 20, category_id: 1 });
            setShowForm(!showForm);
          }}
        >
          <Plus size={18} />
          Add course
        </button>
      </header>

      {showForm && (
        <GlassCard title={editingId ? 'Edit course' : 'New course'} className="form-card">
          <form className="inline-form" onSubmit={handleAdd}>
            <label>
              Name
              <input
                value={form.course_name}
                onChange={(e) => setForm({ ...form, course_name: e.target.value })}
                required
              />
            </label>
            <label>
              Description
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </label>
            <label>
              Hours
              <input
                type="number"
                min={1}
                value={form.duration_hours}
                onChange={(e) =>
                  setForm({ ...form, duration_hours: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Category
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: Number(e.target.value) })
                }
              >
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn btn--primary">{editingId ? 'Update' : 'Save'}</button>
          </form>
        </GlassCard>
      )}

      <GlassCard title={`Courses (${courseList.length})`}>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courseList.map((c) => (
                <tr key={c.course_id}>
                  <td>#{c.course_id}</td>
                  <td><strong>{c.course_name}</strong></td>
                  <td>{getCategoryName(c.category_id)}</td>
                  <td>{c.duration_hours}h</td>
                  <td>
                    <button
                      type="button"
                      className={`badge ${c.status === 1 ? 'status-completed' : 'status-not-started'}`}
                      onClick={() => toggleStatus(c.course_id)}
                    >
                      {c.status === 1 ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="actions-cell">
                    <button type="button" className="icon-btn" title="Edit" onClick={() => startEdit(c)}>
                      <Edit2 size={16} />
                    </button>
                    <button type="button" className="icon-btn icon-btn--danger" title="Delete" onClick={() => handleDelete(c.course_id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

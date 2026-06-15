import { Shield, UserCheck, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { roles, users as fallbackUsers } from '../data/mockData';
import { fetchUsers } from '../services/api';
import type { User } from '../types';

export function UserManagerPage() {
  const [users, setUsers] = useState<User[]>(fallbackUsers);

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => setUsers(fallbackUsers));
  }, []);

  return (
    <div className="page manager-page">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Admin only</p>
          <h1>User Manager</h1>
          <p className="page-header__meta">Manage learners and admins</p>
        </div>
      </header>

      <div className="stat-grid stat-grid--3">
        {roles.map((r) => {
          const count = users.filter((u) => u.role === r.role).length;
          return (
            <div key={r.role} className="role-pill-card">
              <Shield size={20} />
              <span>{r.rolename}</span>
              <strong>{count}</strong>
            </div>
          );
        })}
      </div>

      <GlassCard title={`Users (${users.length})`}>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const role = roles.find((r) => r.role === u.role);
                return (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>
                      <div className="user-cell">
                        <span className="avatar-sm">{u.fullname.charAt(0)}</span>
                        {u.fullname}
                      </div>
                    </td>
                    <td>{u.email_id}</td>
                    <td>{u.phone}</td>
                    <td>
                      <span className="badge badge--role">{role?.rolename}</span>
                    </td>
                    <td>
                      {u.status === 1 ? (
                        <span className="badge status-completed">
                          <UserCheck size={12} /> Active
                        </span>
                      ) : (
                        <span className="badge status-not-started">
                          <UserX size={12} /> Inactive
                        </span>
                      )}
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

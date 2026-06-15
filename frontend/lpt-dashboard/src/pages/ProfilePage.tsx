import { Mail, Phone, Shield, User } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useAuth } from '../context/AuthContext';
import { roles } from '../data/mockData';
import {
  averageScore,
  completionOverview,
  getProgressForUser,
} from '../utils/helpers';

export function ProfilePage() {
  const { user, roleName } = useAuth();
  const records = getProgressForUser(user!.id);
  const overview = completionOverview(records);
  const avgScore = averageScore(records);
  const role = roles.find((r) => r.role === user?.role);

  return (
    <div className="page profile-page">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Account</p>
          <h1>My Profile</h1>
        </div>
      </header>

      <div className="profile-grid">
        <GlassCard className="profile-card-main">
          <div className="profile-hero">
            <div className="profile-avatar-lg">{user?.fullname.charAt(0)}</div>
            <div>
              <h2>{user?.fullname}</h2>
              <p className="profile-role">
                <Shield size={16} />
                {roleName} · Role ID {role?.role}
              </p>
            </div>
            <ProgressRing pct={overview.avgCompletion} size={100} />
          </div>
          <ul className="profile-details">
            <li>
              <Mail size={18} />
              <span>Email</span>
              <strong>{user?.email_id}</strong>
            </li>
            <li>
              <Phone size={18} />
              <span>Phone</span>
              <strong>{user?.phone}</strong>
            </li>
            <li>
              <User size={18} />
              <span>Status</span>
              <strong>{user?.status === 1 ? 'Active' : 'Inactive'}</strong>
            </li>
          </ul>
        </GlassCard>

        <GlassCard title="Learning snapshot">
          <div className="profile-stats">
            <div>
              <span className="label">Courses tracked</span>
              <span className="value">{overview.total}</span>
            </div>
            <div>
              <span className="label">Completed</span>
              <span className="value">{overview.completed}</span>
            </div>
            <div>
              <span className="label">Avg completion</span>
              <span className="value">{overview.avgCompletion}%</span>
            </div>
            <div>
              <span className="label">Avg score</span>
              <span className="value">{avgScore}%</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

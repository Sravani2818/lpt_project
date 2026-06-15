import {
  BarChart3,
  BookOpen,
  Layers,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  UserCircle,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMenuForRole, midToPath } from '../../utils/helpers';

const iconMap: Record<string, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  'book-open': BookOpen,
  'trending-up': TrendingUp,
  layers: Layers,
  users: Users,
  'bar-chart-3': BarChart3,
  'user-circle': UserCircle,
};

export function Sidebar() {
  const { user, roleName, logout } = useAuth();
  const menu = getMenuForRole(user!.role);

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden>
          <span className="sidebar__logo-inner">LT</span>
        </div>
        <div>
          <h1 className="sidebar__title">LearnTrack</h1>
          <p className="sidebar__tagline">Progress Tracker</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {menu.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const path = midToPath(item.mid);
          return (
            <NavLink
              key={item.mid}
              to={path}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <Icon size={18} strokeWidth={1.75} />
              <span>{item.menu}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">{user?.fullname.charAt(0)}</div>
          <div>
            <p className="sidebar__name">{user?.fullname}</p>
            <p className="sidebar__role">{roleName}</p>
          </div>
        </div>
        <button type="button" className="sidebar__logout" onClick={logout}>
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

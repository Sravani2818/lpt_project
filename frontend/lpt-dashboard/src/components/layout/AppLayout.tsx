import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="app-shell">
      <div className="app-shell__grid-bg" aria-hidden />
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

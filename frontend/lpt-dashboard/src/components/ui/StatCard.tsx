import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: 'cyan' | 'purple' | 'green' | 'orange' | 'pink';
}

export function StatCard({ label, value, sub, icon: Icon, accent = 'cyan' }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__glow" aria-hidden />
      <div className="stat-card__icon-wrap">
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <div className="stat-card__body">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {sub && <span className="stat-card__sub">{sub}</span>}
      </div>
    </article>
  );
}

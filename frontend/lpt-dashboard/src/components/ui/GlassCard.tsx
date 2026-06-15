import type { ReactNode } from 'react';

interface GlassCardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function GlassCard({ title, action, children, className = '' }: GlassCardProps) {
  return (
    <section className={`glass-card ${className}`.trim()}>
      {(title || action) && (
        <header className="glass-card__header">
          {title && <h2 className="glass-card__title">{title}</h2>}
          {action}
        </header>
      )}
      <div className="glass-card__body">{children}</div>
    </section>
  );
}

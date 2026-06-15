import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HeroStudent } from './HeroStudent';
import { ParticleField } from './ParticleField';
import { PublicNav } from './PublicNav';
import { SceneBackground } from './SceneBackground';
import { StaggerReveal } from './StaggerReveal';

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer?: ReactNode;
}

export function AuthShell({ children, title, subtitle, footer }: AuthShellProps) {
  return (
    <div className="auth-shell">
      <SceneBackground />
      <ParticleField intense density={1.2} />
      <PublicNav />

      <div className="auth-shell__layout">
        <div className="auth-shell__visual">
          <div className="auth-shell__visual-inner">
            <p className="auth-shell__eyebrow auth-shell__eyebrow--animate">
              <span className="pulse-dot" />
              LearnTrack · Learning Progress Tracking
            </p>
            <h2 className="auth-shell__headline">
              <span className="auth-shell__headline-line">Track.</span>
              <span className="auth-shell__headline-line auth-shell__headline-line--glow">
                Visualize.
              </span>
              <span className="auth-shell__headline-line">Dominate.</span>
            </h2>
            <HeroStudent large />
          </div>
        </div>

        <div className="auth-shell__card-wrap">
          <StaggerReveal>
            <div className="auth-card auth-card--animated">
              <div className="auth-card__border-glow" aria-hidden />
              <h1 className="auth-card__title">{title}</h1>
              <p className="auth-card__subtitle">{subtitle}</p>
              {children}
              {footer}
            </div>
          </StaggerReveal>
          <p className="auth-shell__back">
            <Link to="/">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

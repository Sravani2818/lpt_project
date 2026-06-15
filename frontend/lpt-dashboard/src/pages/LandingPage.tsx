import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  GraduationCap,
  LineChart,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroStudent } from '../components/landing/HeroStudent';
import { ParticleField } from '../components/landing/ParticleField';
import { PublicNav } from '../components/landing/PublicNav';
import { SceneBackground } from '../components/landing/SceneBackground';
import { ScrollReveal } from '../components/landing/ScrollReveal';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    icon: LineChart,
    title: 'Progress that moves',
    desc: 'NOT_STARTED → IN_PROGRESS → COMPLETED — every module tracked in real time.',
  },
  {
    icon: BarChart3,
    title: 'Scores that tell stories',
    desc: 'Performance metrics per course, visualized so learners and admins see the gap instantly.',
  },
  {
    icon: Shield,
    title: 'Roles that matter',
    desc: 'Learner and Admin accounts each see exactly what they need. Nothing more.',
  },
];

const STEPS = [
  { n: '01', title: 'Enroll', desc: 'Pick courses from your catalog — Python, ML, Cloud, and more.' },
  { n: '02', title: 'Learn', desc: 'Complete modules. Scores and completion % update as you go.' },
  { n: '03', title: 'Insight', desc: 'Summaries and analytics surface what to focus on next.' },
];

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="landing">
      <SceneBackground />
      <ParticleField intense density={1.3} />
      <PublicNav />

      <section className={`landing-hero ${heroReady ? 'landing-hero--ready' : ''}`}>
        <div className="landing-hero__copy">
          <p className="landing-hero__eyebrow">
            <Sparkles size={14} />
            PS-25 · Learning Progress Tracking
          </p>
          <h1 className="landing-hero__title">
            <span className="landing-hero__title-line">Your learning.</span>
            <span className="landing-hero__title-line landing-hero__title-line--accent">
              Impossible to ignore.
            </span>
          </h1>
          <p className="landing-hero__sub">
            The dashboard colleges wish they built — progress, performance, and insights in one
            cinematic view.
          </p>
          <div className="landing-hero__actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-landing btn-landing--primary">
                Open dashboard
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-landing btn-landing--primary">
                  Start free
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-landing btn-landing--ghost">
                  Log in
                </Link>
              </>
            )}
          </div>
          <div className="landing-hero__trust">
            <span>4 demo roles</span>
            <span className="landing-hero__dot" />
            <span>JWT-secured API</span>
            <span className="landing-hero__dot" />
            <span>PostgreSQL-backed</span>
          </div>
        </div>

        <div className="landing-hero__visual">
          <HeroStudent />
        </div>

        <a href="#features" className="landing-hero__scroll" aria-label="Scroll to features">
          <ChevronDown size={22} />
          <span>Explore</span>
        </a>
      </section>

      <section id="features" className="landing-section">
        <ScrollReveal>
          <div className="landing-section__header">
            <p className="landing-section__eyebrow">Capabilities</p>
            <h2>Built for reviewers who&apos;ve seen a hundred mediocre dashboards</h2>
          </div>
        </ScrollReveal>
        <div className="landing-features">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <ScrollReveal key={f.title} delay={i * 120}>
                <article className="landing-feature-card">
                  <div className="landing-feature-card__icon">
                    <Icon size={22} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="landing-section landing-section--alt">
        <ScrollReveal>
          <div className="landing-section__header">
            <p className="landing-section__eyebrow">How it works</p>
            <h2>Three steps. Zero clutter.</h2>
          </div>
        </ScrollReveal>
        <div className="landing-steps">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 100}>
              <div className="landing-step">
                <span className="landing-step__n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <ScrollReveal>
        <section className="landing-stats-bar">
          <div className="landing-stats-bar__item">
            <GraduationCap size={28} />
            <strong>100%</strong>
            <span>Completion tracking</span>
          </div>
          <div className="landing-stats-bar__item">
            <BarChart3 size={28} />
            <strong>Live</strong>
            <span>Performance scores</span>
          </div>
          <div className="landing-stats-bar__item">
            <Sparkles size={28} />
            <strong>AI</strong>
            <span>Learning insights</span>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="landing-cta">
          <h2>Ready to make them forget it&apos;s a college project?</h2>
          <p>Create your account or jump in with a demo login.</p>
          <div className="landing-cta__actions">
            <Link to="/signup" className="btn-landing btn-landing--primary btn-landing--lg">
              Get started
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-landing btn-landing--ghost btn-landing--lg">
              Demo login
            </Link>
          </div>
        </section>
      </ScrollReveal>

      <footer className="landing-footer">
            <p>LearnTrack · PS-25 · DSEDBD</p>
        <div className="landing-footer__links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </div>
      </footer>
    </div>
  );
}

import type { CSSProperties } from 'react';
import { BookOpen, Brain, Target, TrendingUp, Trophy, Zap } from 'lucide-react';
import { useMouseParallax } from '../../hooks/useMouseParallax';

const ORBIT_STATS = [
  { label: 'Completion', value: '87%', icon: Target, angle: 0 },
  { label: 'Streak', value: '12d', icon: Zap, angle: 60 },
  { label: 'Score', value: '92', icon: Trophy, angle: 120 },
  { label: 'Courses', value: '5', icon: BookOpen, angle: 180 },
  { label: 'Focus', value: 'High', icon: Brain, angle: 240 },
  { label: 'Growth', value: '+24%', icon: TrendingUp, angle: 300 },
];

interface HeroStudentProps {
  large?: boolean;
}

export function HeroStudent({ large = false }: HeroStudentProps) {
  const parallaxRef = useMouseParallax(0.05);

  return (
    <div className={`hero-student ${large ? 'hero-student--large' : ''}`} aria-hidden>
      <div className="hero-student__glow" />
      <div className="hero-student__glow hero-student__glow--purple" />
      <div className="hero-student__orbit-ring hero-student__orbit-ring--1" />
      <div className="hero-student__orbit-ring hero-student__orbit-ring--2" />
      <div className="hero-student__orbit-ring hero-student__orbit-ring--3" />

      <div className="hero-student__orbit-track">
        {ORBIT_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="hero-student__stat-slot"
              style={{ '--angle': `${stat.angle}deg` } as CSSProperties}
            >
              <div className="hero-student__stat-card">
                <Icon size={16} strokeWidth={2.5} />
                <span className="hero-student__stat-value">{stat.value}</span>
                <span className="hero-student__stat-label">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={parallaxRef} className="hero-student__figure-wrap">
        <svg
          className="hero-student__figure"
          viewBox="0 0 280 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bodyGrad" x1="140" y1="80" x2="140" y2="320" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e3a5f" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="glowGrad" x1="140" y1="40" x2="140" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00f0ff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <ellipse cx="140" cy="330" rx="80" ry="14" fill="rgba(0,240,255,0.12)" />
          <ellipse cx="140" cy="95" rx="60" ry="65" fill="url(#glowGrad)" filter="url(#softGlow)" />
          <path
            d="M95 175 C95 140 115 115 140 115 C165 115 185 140 185 175 L185 280 C185 300 165 310 140 310 C115 310 95 300 95 280 Z"
            fill="url(#bodyGrad)"
            stroke="rgba(0,240,255,0.5)"
            strokeWidth="2"
          />
          <circle cx="140" cy="88" r="44" fill="#1a2744" stroke="rgba(0,240,255,0.55)" strokeWidth="2" />
          <ellipse cx="140" cy="82" rx="40" ry="38" fill="#243352" />
          <path d="M108 72 Q140 52 172 72" stroke="#00f0ff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="125" cy="88" r="6" fill="#00f0ff" className="hero-student__eye" />
          <circle cx="155" cy="88" r="6" fill="#00f0ff" className="hero-student__eye" />
          <circle cx="125" cy="88" r="2.5" fill="#050810" />
          <circle cx="155" cy="88" r="2.5" fill="#050810" />
          <path d="M130 102 Q140 112 150 102" stroke="rgba(0,240,255,0.7)" strokeWidth="2" fill="none" />
          <rect x="118" y="130" width="44" height="8" rx="4" fill="rgba(0,240,255,0.35)" />
          <rect x="100" y="155" width="28" height="70" rx="14" fill="#1e3a5f" stroke="rgba(124,58,237,0.6)" strokeWidth="1.5" />
          <rect x="152" y="155" width="28" height="70" rx="14" fill="#1e3a5f" stroke="rgba(124,58,237,0.6)" strokeWidth="1.5" />
          <rect x="108" y="200" width="64" height="48" rx="8" fill="#0c1220" stroke="rgba(0,240,255,0.6)" strokeWidth="2" />
          <rect x="116" y="210" width="48" height="5" rx="2.5" fill="#00f0ff" opacity="0.9" className="hero-student__bar" />
          <rect x="116" y="222" width="36" height="4" rx="2" fill="rgba(148,163,184,0.5)" />
          <rect x="116" y="232" width="42" height="4" rx="2" fill="rgba(148,163,184,0.35)" />
          <circle cx="168" cy="224" r="7" fill="#7c3aed" opacity="0.95" />
          <rect x="115" y="285" width="22" height="55" rx="11" fill="#152238" stroke="rgba(0,240,255,0.35)" strokeWidth="1.5" />
          <rect x="143" y="285" width="22" height="55" rx="11" fill="#152238" stroke="rgba(0,240,255,0.35)" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

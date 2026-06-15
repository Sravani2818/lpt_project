import { useEffect, useState, type ReactNode } from 'react';

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  baseDelay?: number;
}

export function StaggerReveal({ children, className = '', baseDelay = 0 }: StaggerRevealProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50 + baseDelay);
    return () => clearTimeout(t);
  }, [baseDelay]);

  return (
    <div className={`stagger-reveal ${ready ? 'stagger-reveal--ready' : ''} ${className}`}>
      {children}
    </div>
  );
}

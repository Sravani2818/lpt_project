import { Zap } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthShell } from '../components/landing/AuthShell';
import { useAuth } from '../context/AuthContext';
import { demoCredentials } from '../data/mockData';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('learner@lpt.com');
  const [password, setPassword] = useState('learner123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) setError('Invalid email or password');
  };

  const quickLogin = (cred: (typeof demoCredentials)[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your LearnTrack dashboard.">
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@lpt.com"
            required
            autoComplete="email"
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="login-form__error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--primary btn--glow btn--block" disabled={loading}>
          <Zap size={18} />
          {loading ? 'Authenticating…' : 'Enter dashboard'}
        </button>
      </form>

      <div className="login-demo">
        <p className="login-demo__label">Quick demo login</p>
        <div className="login-demo__chips">
          {demoCredentials.map((c) => (
            <button key={c.email} type="button" className="chip" onClick={() => quickLogin(c)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <p className="auth-card__switch">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}

import { UserPlus, Zap } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthShell } from '../components/landing/AuthShell';
import { useAuth } from '../context/AuthContext';

export function SignUpPage() {
  const { isAuthenticated, signup } = useAuth();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<1 | 3>(1);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only Gmail addresses are allowed (@gmail.com)');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const ok = await signup({ fullname, email_id: email, phone, password, role });
    setLoading(false);
    if (!ok) {
      setError('Could not create account. Email may already exist.');
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <AuthShell
        title="You're in."
        subtitle="Account created — log in to open your dashboard."
        footer={
          <Link to="/login" className="btn btn--primary btn--glow btn--block">
            <Zap size={18} />
            Go to login
          </Link>
        }
      >
        <p className="auth-success-msg">
          Welcome, <strong>{fullname}</strong>. Your {role === 3 ? 'admin' : 'learner'} profile is ready.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create account" subtitle="Join as a learner — track every course from day one.">
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Account type</span>
          <select value={role} onChange={(e) => setRole(Number(e.target.value) as 1 | 3)} required>
            <option value={1}>Learner</option>
            <option value={3}>Admin</option>
          </select>
        </label>
        <label className="field">
          <span>Full name</span>
          <input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Priya Sharma"
            required
            autoComplete="name"
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            required
            autoComplete="email"
          />
        </label>
        <label className="field">
          <span>Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            autoComplete="tel"
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
            minLength={6}
            autoComplete="new-password"
          />
        </label>
        <label className="field">
          <span>Confirm password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </label>
        {error && (
          <p className="login-form__error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--primary btn--glow btn--block" disabled={loading}>
          <UserPlus size={18} />
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-card__switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthShell>
  );
}

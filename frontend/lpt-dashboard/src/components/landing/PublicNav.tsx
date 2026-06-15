import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function PublicNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="public-nav">
      <Link to="/" className="public-nav__logo">
        <span className="public-nav__logo-mark">Learn</span>
        <span className="public-nav__logo-text">Track</span>
      </Link>

      <button
        type="button"
        className="public-nav__toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <nav className={`public-nav__links ${open ? 'public-nav__links--open' : ''}`}>
        {isLanding && (
          <>
            <a href="#features" onClick={() => setOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" onClick={() => setOpen(false)}>
              How it works
            </a>
          </>
        )}
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" onClick={() => setOpen(false)}>
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <button
              type="button"
              className="public-nav__logout"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              <LogOut size={16} />
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link to="/signup" className="public-nav__cta" onClick={() => setOpen(false)}>
              Get started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

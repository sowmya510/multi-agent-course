import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      await signup(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Could not create your account.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="logo display">🧭 Lab Quest</h1>
        <p className="tagline">Join the Explorer Club and start your science journal!</p>
        <form onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Make a password" required />
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary block">Create account</button>
        </form>
        <p className="switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Email or password is incorrect.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="logo display">🧭 Lab Quest</h1>
        <p className="tagline">Welcome back, explorer! Ready for more science?</p>
        <form onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary block">Log in</button>
        </form>
        <p className="switch">New here? <Link to="/signup">Create an account</Link></p>
      </div>
    </div>
  );
}

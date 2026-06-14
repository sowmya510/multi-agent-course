import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">🧭 Lab Quest</Link>
      <div className="nav-links">
        <Link to="/">Explore</Link>
        <Link to="/saved">My journal</Link>
        {user && <span className="nav-user">{user.email}</span>}
        <button className="btn-ghost" onClick={onLogout}>Log out</button>
      </div>
    </nav>
  );
}

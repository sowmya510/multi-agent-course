import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Search from './pages/Search.jsx';
import Detail from './pages/Detail.jsx';
import Saved from './pages/Saved.jsx';
import NavBar from './components/NavBar.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Protected><Search /></Protected>} />
      <Route path="/experiments/:id" element={<Protected><Detail /></Protected>} />
      <Route path="/saved" element={<Protected><Saved /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

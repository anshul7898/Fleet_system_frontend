import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Check if user is logged in
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  // Not logged in
  if (!isLoggedIn) return <Navigate to="/" replace />;

  return children;
}

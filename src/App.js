import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './pages/Login';
import RidersComponent from './pages/RidersComponent';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/RidersComponent"
          element={
            <ProtectedRoute>
              <RidersComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

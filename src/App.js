import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './pages/LoginComponent';
import RidersComponent from './pages/RidersComponentComponent';
import DashboardComponent from './pages/DashboardComponent';
import PaymentsComponent from './pages/PaymentsComponent';
import VehiclesSummaryComponent from './pages/VehiclesSummaryComponent';
import UserSummaryComponent from './pages/UserSummaryComponent';
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
        <Route
          path="/DashboardComponent"
          element={
            <ProtectedRoute>
              <DashboardComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/PaymentsComponent"
          element={
            <ProtectedRoute>
              <PaymentsComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/VehiclesSummaryComponent"
          element={
            <ProtectedRoute>
              <VehiclesSummaryComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserSummaryComponent"
          element={
            <ProtectedRoute>
              <UserSummaryComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

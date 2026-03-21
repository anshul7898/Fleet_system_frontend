import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './pages/LoginComponent';
import RidersComponent from './pages/RidersComponent';
import DashboardComponent from './pages/DashboardComponent';
import PaymentsComponent from './pages/PaymentsComponent';
import VehiclesSummaryComponent from './pages/VehiclesSummaryComponent';
import UserSummaryComponent from './pages/UserSummaryComponent';
import RefundSummaryComponent from './pages/RefundSummaryComponent';
import EmployeesListComponent from './pages/EmployeesListComponent';
import EngagementComponent from './pages/EngagementComponent';
import VehicleMaintenanceComponent from './pages/VehicleMaintenanceComponent';
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
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <DashboardComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Payments"
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
        <Route
          path="/RefundSummaryComponent"
          element={
            <ProtectedRoute>
              <RefundSummaryComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EmployeesListComponent"
          element={
            <ProtectedRoute>
              <EmployeesListComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EngagementComponent"
          element={
            <ProtectedRoute>
              <EngagementComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/VehicleMaintenanceComponent"
          element={
            <ProtectedRoute>
              <VehicleMaintenanceComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

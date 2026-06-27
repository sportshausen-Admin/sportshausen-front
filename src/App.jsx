import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookerDashboard from './pages/BookerDashboard';
import AgrupacionDashboard from './pages/AgrupacionDashboard';
import PanelDeLuchador from './pages/PanelDeLuchador';
import LuchadorDashboard from './pages/LuchadorDashboard';
import MisEventos from './pages/MisEventos';
import Ofertas from './pages/Ofertas';
import Notificaciones from './pages/Notificaciones';
import PerfilLuchador from './pages/PerfilLuchador';
import { CalendarioDisponibilidad } from './pages/CalendarioDisponibilidad';
import AgendaAgrupacion from './pages/AgendaAgrupacion';
import Mensajeria from './pages/Mensajeria';
import MisTicketsLuchador from './pages/MisTicketsLuchador';
import GestionarTicketsAgrupacion from './pages/GestionarTicketsAgrupacion';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas - Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Rutas de Autenticación - Solo accesibles sin autenticar */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Rutas de Dashboard - Protegidas, accesibles solo autenticados */}
        <Route
          path="/dashboard/luchador"
          element={<Navigate to="/panel/luchador" replace />}
        />
        <Route
          path="/dashboard/booker"
          element={
            <ProtectedRoute requiredRole="booker">
              <BookerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/agrupacion"
          element={
            <ProtectedRoute requiredRole="agrupacion">
              <AgrupacionDashboard />
            </ProtectedRoute>
          }
        />

        {/* Rutas del Panel - Protegidas para luchadores */}
        <Route
          path="/panel/luchador"
          element={
            <ProtectedRoute requiredRole="luchador">
              <PanelDeLuchador />
            </ProtectedRoute>
          }
        />

        {/* Ruta de Perfil - Protegida */}
        <Route
          path="/perfil/:id"
          element={
            <ProtectedRoute>
              <PerfilLuchador />
            </ProtectedRoute>
          }
        />

        {/* Ruta de Calendario - Solo luchadores */}
        <Route
          path="/calendario-disponibilidad"
          element={
            <ProtectedRoute requiredRole="luchador">
              <CalendarioDisponibilidad />
            </ProtectedRoute>
          }
        />

        {/* Agenda de Agrupación - Protegida */}
        <Route
          path="/agenda/agrupacion"
          element={
            <ProtectedRoute requiredRole="agrupacion">
              <AgendaAgrupacion />
            </ProtectedRoute>
          }
        />

        {/* Eventos, Ofertas, Notificaciones */}
        <Route path="/mis-eventos" element={<ProtectedRoute><MisEventos /></ProtectedRoute>} />
        <Route path="/ofertas" element={<ProtectedRoute><Ofertas /></ProtectedRoute>} />
        <Route path="/notificaciones" element={<ProtectedRoute><Notificaciones /></ProtectedRoute>} />

        {/* Mensajería */}
        <Route
          path="/mensajeria"
          element={
            <ProtectedRoute>
              <Mensajeria />
            </ProtectedRoute>
          }
        />

        {/* Tickets - Luchador */}
        <Route
          path="/mis-tickets"
          element={
            <ProtectedRoute requiredRole="luchador">
              <MisTicketsLuchador />
            </ProtectedRoute>
          }
        />

        {/* Tickets - Agrupación */}
        <Route
          path="/tickets/agrupacion"
          element={
            <ProtectedRoute requiredRole="agrupacion">
              <GestionarTicketsAgrupacion />
            </ProtectedRoute>
          }
        />

        {/* Páginas especiales */}
        <Route path="/not-found" element={<NotFound />} />

        {/* Redirecciones por rutas inválidas */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

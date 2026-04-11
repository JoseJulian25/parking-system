import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "../components/Layout";
import { DashboardPage } from "../pages/DashboardPage";
import { EntradaPage } from "../pages/EntradaPage";
import { HistorialPage } from "../pages/HistorialPage";
import  {LoginPage}  from "../pages/LoginPage.jsx";
import { ReservasPage } from "../pages/ReservasPage";
import { ConfiguracionPage } from "../pages/ConfiguracionPage";
import { UsuariosPage } from "../pages/UsuariosPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute/>}>
        <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/entrada" element={<EntradaPage />} />
        <Route path="/salida" element={<Navigate to="/entrada" replace />} />
        <Route path="/espacios" element={<Navigate to="/entrada" replace />} />
        <Route path="/reservas" element={<ReservasPage />} />
        <Route path="/historial" element={<HistorialPage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />
        <Route path="/tarifas" element={<Navigate to="/configuracion" replace />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
      </Route>
    </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

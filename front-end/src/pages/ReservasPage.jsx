import { useEffect, useState } from "react";

import {
  getReservasActivas,
  getReservasPendientes,
  getHistorialReservas
} from "../api/reservas";

import CrearReserva from "../components/reservas/CrearReserva";
import ConfirmarLlegada from "../components/reservas/ConfirmarLlegada";
import RegistrarSalida from "../components/reservas/RegistrarSalida";
import ListaReservas from "../components/reservas/ListaReservas";

export const ReservasPage = () => {

  const [reservasActivas, setReservasActivas] = useState([]);
  const [reservasPendientes, setReservasPendientes] = useState([]);
  const [historial, setHistorial] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReservas = async () => {
    try {
      setLoading(true);

      const [
        activas,
        pendientes,
        historialData
      ] = await Promise.all([
        getReservasActivas(),
        getReservasPendientes(),
        getHistorialReservas()
      ]);

      setReservasActivas(activas);
      setReservasPendientes(pendientes);
      setHistorial(historialData);

    } catch (err) {
      console.error(err);
      setError("Error cargando reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="p-6 text-center">
        Cargando reservas...
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <CrearReserva onSuccess={fetchReservas} />

      <ConfirmarLlegada onSuccess={fetchReservas} />

      <RegistrarSalida onSuccess={fetchReservas} />
      <ListaReservas
        activas={reservasActivas}
        pendientes={reservasPendientes}
        historial={historial}
        refresh={fetchReservas}
      />

    </div>
  );
}
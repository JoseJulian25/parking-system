import { useState, useEffect } from "react";

import CrearReserva from "../components/reservas/CrearReserva";
import ConfirmarLlegada from "../components/reservas/ConfirmarLlegada";
import ListaReservas from "../components/reservas/ListaReservas";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../components/ui/tabs";
import client from "../api/client";

export const ReservasPage = () => {

  const [refresh, setRefresh] = useState(false);
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };



const fetchEspacios = async () => {
  try {
    setLoading(true);

    const response = await client.get("/espacios");

    setEspacios(response.data);

  } catch (error) {
    console.error("Error obteniendo espacios", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEspacios();
  }, [refresh]);

  return (

    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold">
          Gestión de Reservas
        </h1>

        <p className="text-gray-500">
          Cree, confirme y administre las reservas del parqueo
        </p>
      </div>

      <Tabs defaultValue="crear" className="space-y-4">

        <TabsList>

          <TabsTrigger value="crear">
            Crear Reserva
          </TabsTrigger>

          <TabsTrigger value="confirmar">
            Confirmar Llegada
          </TabsTrigger>

          <TabsTrigger value="activas">
            Reservas Activas
          </TabsTrigger>

        </TabsList>

        <TabsContent value="crear">
          <CrearReserva 
            espacios={espacios}
            loading={loading}
            onSuccess={handleRefresh} 
          />
        </TabsContent>

        <TabsContent value="confirmar">
          <ConfirmarLlegada 
            onSuccess={handleRefresh} 
          />
        </TabsContent>

        <TabsContent value="activas">
          <ListaReservas 
            refresh={refresh} 
          />
        </TabsContent>

      </Tabs>

    </div>

  );

};
import { useState } from "react";

import CrearReserva from "../components/reservas/CrearReserva";
import ListaReservas from "../components/reservas/ListaReservas";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../components/ui/tabs";
export const ReservasPage = () => {

  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (

    <div className="space-y-6">

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de Reservas
        </h1>
        <p className="text-sm text-muted-foreground">
          Confirme llegadas y gestione salidas directamente desde la lista de gestión.
        </p>
      </div>

      <Tabs defaultValue="crear" className="space-y-4">

        <TabsList className="grid w-full grid-cols-2 border border-primary/20 bg-primary/5 md:w-auto md:inline-grid">

          <TabsTrigger
            value="crear"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Crear Reserva
          </TabsTrigger>

          <TabsTrigger
            value="activas"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Gestionar Reservas
          </TabsTrigger>

        </TabsList>

        <TabsContent value="crear">
          <CrearReserva
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
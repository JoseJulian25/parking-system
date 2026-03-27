import { useState, useEffect } from "react";

import { getEspacios, updateEstadoEspacio, addEspaciosLote, deleteEspacio } from "../api/espacios";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";

import EspacioEstadoDialog from "../components/espacios/EspacioEstadoDialog";
import AddEspaciosDialog from "../components/espacios/AddEspaciosDialog";


import { Car, Bike, Settings, Plus } from "lucide-react";

export function EspaciosPage() {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEspacio, setSelectedEspacio] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    fetchEspacios();
  }, []);

  const fetchEspacios = async () => {
    try {
      setLoading(true);
      const data = await getEspacios();
      setEspacios(data);
      setError("");
    } catch (err) {
      setError("Error cargando espacios");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (espacio) => {
    setSelectedEspacio(espacio);
    setOpenDialog(true);
  };

  const handleUpdateEstado = async (nuevoEstado) => {
    try {
      if (nuevoEstado === selectedEspacio.estado) {
      setOpenDialog(false);
      return;
    }
      await updateEstadoEspacio(selectedEspacio.id, nuevoEstado);

      setEspacios((prev) =>
        prev.map((e) =>
          e.id === selectedEspacio.id ? { ...e, estado: nuevoEstado } : e
        )
      );

      setOpenDialog(false);
      setSelectedEspacio(null);
      setError("");
    } catch (err) {
      setError("Error actualizando estado");
      throw err;
    }
  };

const handleAddEspacios = async (data) => {
  try {
    await addEspaciosLote({
      cantidadCarros: data.carros,
      cantidadMotos: data.motos
    });

    await fetchEspacios();
    setOpenAddDialog(false);

  } catch (error) {
    console.log(error);
    setError("Error agregando espacios");
  }
};

const handleDeleteEspacio = async (id) => {
  const confirmacion = window.confirm(
    "¿Seguro que deseas eliminar este espacio? Esta acción no se puede deshacer."
  );

  if (!confirmacion) return;

  try {
    await deleteEspacio(id);

    setEspacios((prev) => prev.filter((e) => e.id !== id));

    setError("");
  } catch (err) {
    setError("No se puede eliminar el espacio. Puede estar en uso.");
  }
};

  const espaciosCarros = espacios.filter(
    (e) => e.tipoVehiculo === "CARRO"
  );

  const espaciosMotos = espacios.filter(
    (e) => e.tipoVehiculo === "MOTO"
  );

  const stats = {
    libre: espacios.filter((e) => e.estado === "LIBRE").length,
    ocupado: espacios.filter((e) => e.estado === "OCUPADO").length,
    reservado: espacios.filter((e) => e.estado === "RESERVADO").length,
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "LIBRE":
        return "bg-green-100 border-green-300";
      case "OCUPADO":
        return "bg-red-100 border-red-300";
      case "RESERVADO":
        return "bg-yellow-100 border-yellow-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getStatusBadgeVariant = (estado) => {
    switch (estado) {
      case "LIBRE":
        return "secondary";
      case "OCUPADO":
        return "destructive";
      case "":
        return "outline";

      default:
        return "secondary";
    }
  };

  const renderEspacios = (lista) => {
    if (!lista.length) return <p>No hay espacios disponibles</p>;

    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {lista.map((space) => {
          const ticket = space.ticketActivo;

          return (
            <div
              key={space.id}
              className={`relative group p-4 rounded-lg border-2 transition-all ${getStatusColor(
                space.estado
              )}`}
            >
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleOpenDialog(space)} 
                  className="bg-black/70 text-white p-1 rounded"
                  >
                  <Settings className="w-4 h-4" />
                </button>
                  {space.estado === "LIBRE" && (
                <button
                  onClick={() => handleDeleteEspacio(space.id)}
                  className="bg-red-600 text-white p-1 rounded"
                >✕
                </button>
              )}
          </div>

              <div className="text-center">
                <p className="text-2xl font-bold mb-1">
                  {space.numero}
                </p>

                <Badge variant={getStatusBadgeVariant(space.estado)}>
                  {space.estado}
                </Badge>

                {ticket && (
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <p className="text-xs font-medium truncate">
                      {ticket.placa}
                    </p>
                    <p className="text-xs opacity-75">
                      {ticket.horaEntrada}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return <p>Cargando espacios...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Gestión de Espacios
          </h1>
          <p className="text-muted-foreground">
            Vista en tiempo real del estado del parqueo
          </p>
        </div>

        <Button onClick={() => setOpenAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Espacios
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-600 p-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm">Libres</p>
          <p className="text-2xl font-bold text-green-700">
            {stats.libre}
          </p>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm">Ocupados</p>
          <p className="text-2xl font-bold text-red-700">
            {stats.ocupado}
          </p>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm">Reservado</p>
          <p className="text-2xl font-bold text-yellow-700">
            {stats.reservado}
          </p>
        </div>

      </div>

      <Card>
        <CardHeader>
          <CardTitle>Espacios del Parqueo</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="carros" className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="carros">
                <Car className="w-4 h-4 mr-2" />
                Carros ({espaciosCarros.length})
              </TabsTrigger>

              <TabsTrigger value="motos">
                <Bike className="w-4 h-4 mr-2" />
                Motos ({espaciosMotos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="carros">
              {renderEspacios(espaciosCarros)}
            </TabsContent>

            <TabsContent value="motos">
              {renderEspacios(espaciosMotos)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {openDialog && selectedEspacio && (
        <EspacioEstadoDialog
          espacio={selectedEspacio}
          onClose={() => setOpenDialog(false)}
          onSave={handleUpdateEstado}
        />
      )}

      <AddEspaciosDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSave={handleAddEspacios}
      />
    </div>
  );
}
import { useState, useEffect } from "react";
import {
  getEspacios,
  updateEstadoEspacio,
  addEspaciosLote,
  deleteEspacio,
} from "../api/espacios";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { Car, Bike, Plus, Settings, Trash2 } from "lucide-react";

export function EspaciosPage() {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [espacioEditando, setEspacioEditando] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");

  const [cantidadCarros, setCantidadCarros] = useState("0");
  const [cantidadMotos, setCantidadMotos] = useState("0");

  useEffect(() => {
    fetchEspacios();
  }, []);

  const fetchEspacios = async () => {
    try {
      setLoading(true);
      const data = await getEspacios();
      setEspacios(data);
    } catch (err) {
      console.log(err);
      setError("Error cargando espacios");
    } finally {
      setLoading(false);
    }
  };

  const espaciosCarros = espacios.filter(e => e.tipoVehiculo === "CARRO");
  const espaciosMotos = espacios.filter(e => e.tipoVehiculo === "MOTO");

  const stats = {
    libre: espacios.filter(e => e.estado === "LIBRE").length,
    ocupado: espacios.filter(e => e.estado === "OCUPADO").length,
    reservado: espacios.filter(e => e.estado === "RESERVADO").length,
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
      case "RESERVADO":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleEditarEstado = (space) => {
    setEspacioEditando(space);
    setNuevoEstado(space.estado);
    setShowEditDialog(true);
  };

  const handleGuardarEstado = async () => {
    try {
      await updateEstadoEspacio(espacioEditando.id, nuevoEstado);
      setShowEditDialog(false);
      fetchEspacios();
    } catch {
      alert("Error actualizando estado");
    }
  };

  const handleEliminarEspacio = async (space) => {
    if (!confirm("¿Eliminar este espacio?")) return;

    try {
      await deleteEspacio(space.id);
      fetchEspacios();
    } catch {
      alert("Error eliminando espacio");
    }
  };

  const handleAgregarEspacios = async () => {
    try {
      await addEspaciosLote({
        carros: parseInt(cantidadCarros) || 0,
        motos: parseInt(cantidadMotos) || 0,
      });

      setShowAddDialog(false);
      setCantidadCarros("0");
      setCantidadMotos("0");

      fetchEspacios();
    } catch {
      alert("Error agregando espacios");
    }
  };

  const renderEspacios = (lista) => {
    if (!lista.length) return <p>No hay espacios</p>;

    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {lista.map((space) => {
          const ticket = space.ticketActivo;

          return (
            <div
              key={space.id}
              className={`group relative p-4 rounded-lg border-2 ${getStatusColor(space.estado)}`}
            >
              <div className="text-center">
                <p className="text-2xl font-bold">{space.numero}</p>

                <Badge variant={getStatusBadgeVariant(space.estado)}>
                  {space.estado}
                </Badge>

                {ticket && (
                  <div className="mt-2 text-xs">
                    <p>{ticket.placa}</p>
                    <p>{ticket.horaEntrada}</p>
                  </div>
                )}
              </div>

              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => handleEditarEstado(space)}>
                  <Settings className="w-3 h-3" />
                </Button>

                {space.estado === "LIBRE" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEliminarEspacio(space)}
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  if (loading) return <p>Cargando espacios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-6">

      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Espacios</h1>

        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>


      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded">{stats.libre} Libres</div>
        <div className="p-4 bg-red-50 rounded">{stats.ocupado} Ocupados</div>
        <div className="p-4 bg-yellow-50 rounded">{stats.reservado} Reservados</div>
      </div>


      <Tabs defaultValue="carros">
        <TabsList>
          <TabsTrigger value="carros">Carros</TabsTrigger>
          <TabsTrigger value="motos">Motos</TabsTrigger>
        </TabsList>

        <TabsContent value="carros">
          {renderEspacios(espaciosCarros)}
        </TabsContent>

        <TabsContent value="motos">
          {renderEspacios(espaciosMotos)}
        </TabsContent>
      </Tabs>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar estado</DialogTitle>
          </DialogHeader>

          <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LIBRE">Libre</SelectItem>
              <SelectItem value="OCUPADO">Ocupado</SelectItem>
              <SelectItem value="RESERVADO">Reservado</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button onClick={handleGuardarEstado}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar espacios</DialogTitle>
          </DialogHeader>

          <Label>Carros</Label>
          <Input
            type="number"
            value={cantidadCarros}
            onChange={(e) => setCantidadCarros(e.target.value)}
          />

          <Label>Motos</Label>
          <Input
            type="number"
            value={cantidadMotos}
            onChange={(e) => setCantidadMotos(e.target.value)}
          />

          <DialogFooter>
            <Button onClick={handleAgregarEspacios}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
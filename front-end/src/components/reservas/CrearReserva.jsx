import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  crearReserva
} from "../../api/reservas";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getEspacios } from "@/api/espacios";

export default function CrearReserva({ onSuccess }) {

  const [placa, setPlaca] = useState("");
  const [tipoVehiculo, setTipoVehiculo] = useState("CARRO");
  const [fechaReserva, setFechaReserva] = useState("");

  const [espacioId, setEspacioId] = useState("");
  const [espacios, setEspacios] = useState([]);
  const [reservaCreada, setReservaCreada] = useState(null);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const [loading, setLoading] = useState(false);

  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("es-DO", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date);
  };

  const fetchEspacios = async () => {
    try {
      const data = await getEspacios();
      setEspacios(data);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando espacios disponibles");
    }
  };

  useEffect(() => {
    fetchEspacios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const fechaHoraInicio = `${fechaReserva}T${horaInicio}:00`;
      const fechaHoraFin = `${fechaReserva}T${horaFin}:00`;

      if (fechaHoraFin <= fechaHoraInicio) {
        throw new Error("La hora fin debe ser mayor que la hora inicio");
      }

      const espacioSeleccionado = espacios.find(
        (espacio) => espacio.id === Number(espacioId)
      );

      if (!espacioSeleccionado) {
        throw new Error("Debe seleccionar un espacio valido");
      }

      const data = {
        espacioId: espacioSeleccionado.id,
        placa,
        tipoVehiculo,
        horaInicio: fechaHoraInicio,
        horaFin: fechaHoraFin,
        clienteNombreCompleto: `${nombre} ${apellido}`.trim(),
        clienteTelefono: telefono,
        clienteEmail: email
      };

      const reservaCreadaResponse = await crearReserva(data);

      setReservaCreada({
        codigoReserva: reservaCreadaResponse.codigoReserva,
        nombre: reservaCreadaResponse.clienteNombreCompleto,
        email: reservaCreadaResponse.clienteEmail,
        telefono: reservaCreadaResponse.clienteTelefono,
        placa: reservaCreadaResponse.placa,
        tipoVehiculo: reservaCreadaResponse.tipoVehiculo,
        horaInicio: reservaCreadaResponse.horaInicio,
        horaFin: reservaCreadaResponse.horaFin,
        espacio: reservaCreadaResponse.codigoEspacio
      });

      toast.success("Reserva creada correctamente");

      setPlaca("");
      setFechaReserva("");
      setHoraInicio("");
      setHoraFin("");
      setNombre("");
      setApellido("");
      setEmail("");
      setTelefono("");
      setEspacioId("");

      await fetchEspacios();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const mensajeError =
        err?.response?.data?.message ||
        err.message ||
        "Error creando reserva";

      console.error("Error creando reserva:", err?.response?.data || err);
      toast.error(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const espaciosLibres = espacios.filter(
    (espacio) => espacio.estado === "LIBRE"
  );

  const carrosDisponibles = espaciosLibres.filter(
    (espacio) => espacio.tipoVehiculo === "CARRO"
  ).length;

  const motosDisponibles = espaciosLibres.filter(
    (espacio) => espacio.tipoVehiculo === "MOTO"
  ).length;

  const espaciosFiltrados = espaciosLibres.filter(
    (espacio) => espacio.tipoVehiculo === tipoVehiculo
  );

  return (
    <div className="space-y-6">
      {reservaCreada && (
        <Card className="border-emerald-300 bg-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-emerald-700 text-base">
              Reserva creada
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-2 text-sm md:grid-cols-2">
            <div><strong>Codigo:</strong> {reservaCreada.codigoReserva}</div>
            <div><strong>Espacio:</strong> {reservaCreada.espacio}</div>
            <div><strong>Cliente:</strong> {reservaCreada.nombre}</div>
            <div><strong>Placa:</strong> {reservaCreada.placa}</div>
            <div><strong>Inicio:</strong> {formatDateTime(reservaCreada.horaInicio)}</div>
            <div><strong>Fin:</strong> {formatDateTime(reservaCreada.horaFin)}</div>
            <div className="md:col-span-2 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(reservaCreada.codigoReserva);
                  toast.success("Codigo de reserva copiado");
                }}
              >
                Copiar codigo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Espacios para Carros
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-semibold">
              {carrosDisponibles}
            </div>
            <p className="text-xs text-muted-foreground">
              disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Espacios para Motos
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-semibold">
              {motosDisponibles}
            </div>
            <p className="text-xs text-muted-foreground">
              disponibles
            </p>
          </CardContent>
        </Card>

      </div>

      <Card>

        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Nueva Reserva
          </CardTitle>
        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                  required
                />
              </div>

              <div>
                <Label>Apellido</Label>
                <Input
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Apellido"
                  required
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  required
                />
              </div>

              <div>
                <Label>Telefono</Label>
                <Input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="809-555-1234"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Tipo de Vehículo</Label>

              <div className="flex gap-6">

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="CARRO"
                    checked={tipoVehiculo === "CARRO"}
                    onChange={(e) =>
                      setTipoVehiculo(e.target.value)
                    }
                  />
                  Carro
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="MOTO"
                    checked={tipoVehiculo === "MOTO"}
                    onChange={(e) =>
                      setTipoVehiculo(e.target.value)
                    }
                  />
                  Moto
                </label>

              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Placa del Vehículo</Label>
                <Input
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  placeholder="A123456"
                  required
                />
              </div>

              <div>
                <Label>Seleccionar Parqueo</Label>
                <select
                  className="w-full border rounded-md p-2 h-10 text-sm"
                  value={espacioId}
                  onChange={(e) => setEspacioId(e.target.value)}
                  required
                >
                  <option value="">Seleccione un parqueo</option>

                  {espaciosFiltrados.map((espacio) => (
                    <option key={espacio.id} value={espacio.id}>
                      {espacio.codigoEspacio} - {espacio.tipoVehiculo}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  {espaciosFiltrados.length} espacios disponibles para {tipoVehiculo.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Fecha Reserva</Label>
                <Input
                  type="date"
                  value={fechaReserva}
                  onChange={(e) => setFechaReserva(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div>
                <Label>Hora Inicio</Label>
                <Input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Hora Fin</Label>
                <Input
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="min-w-40"
                disabled={loading || espaciosFiltrados.length === 0}
              >
                {loading ? "Creando..." : "Crear Reserva"}
              </Button>
            </div>

          </form>

        </CardContent>

      </Card>

    </div>

  );

}
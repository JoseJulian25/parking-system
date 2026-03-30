import { useEffect, useState } from "react";
import {
  crearReserva,
  getEspaciosDisponibles
} from "../../api/reservas";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";

export default function CrearReserva({ onSuccess }) {

  const [placa, setPlaca] = useState("");
  const [tipoVehiculo, setTipoVehiculo] = useState("carro");
  const [fechaReserva, setFechaReserva] = useState("");
  const [horaReserva, setHoraReserva] = useState("");

  const [espacios, setEspacios] = useState({
    carros: 0,
    motos: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchEspacios = async () => {
    try {
      const data = await getEspaciosDisponibles();
      setEspacios(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEspacios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!placa || !fechaReserva || !horaReserva) {
      setError("Complete todos los campos");
      return;
    }

    try {

      setLoading(true);

      await crearReserva({
        placa,
        tipoVehiculo,
        fechaReserva,
        horaReserva
      });

      setSuccess("Reserva creada correctamente");

      setPlaca("");
      setFechaReserva("");
      setHoraReserva("");

      fetchEspacios();

      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      console.error(err);
      setError("Error creando reserva");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-lg font-semibold mb-4">
        Crear Reserva
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>

          <Label>Placa</Label>

          <Input
            value={placa}
            onChange={(e) => setPlaca(e.target.value.toUpperCase())}
            placeholder="ABC123"
          />

        </div>


        <div>

          <Label>Tipo Vehículo</Label>

          <select
            className="w-full border rounded p-2"
            value={tipoVehiculo}
            onChange={(e) => setTipoVehiculo(e.target.value)}
          >

            <option value="carro">Carro</option>
            <option value="moto">Moto</option>

          </select>

        </div>


        <div>

          <Label>Fecha</Label>

          <Input
            type="date"
            value={fechaReserva}
            onChange={(e) => setFechaReserva(e.target.value)}
          />

        </div>


        <div>

          <Label>Hora</Label>

          <Input
            type="time"
            value={horaReserva}
            onChange={(e) => setHoraReserva(e.target.value)}
          />

        </div>


        {/* Espacios disponibles */}

        <div className="text-sm text-gray-500">

          Carros disponibles: {espacios.carros} | 
          Motos disponibles: {espacios.motos}

        </div>


        {error && (

          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>

        )}

        {success && (

          <Alert>
            <AlertDescription>
              {success}
            </AlertDescription>
          </Alert>

        )}

        <Button
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Reserva"}
        </Button>

      </form>

    </div>

  );

}
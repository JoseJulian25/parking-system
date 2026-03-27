import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddEspaciosDialog({ open, onClose, onSave }) {
  const [carros, setCarros] = useState(0);
  const [motos, setMotos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    const carrosNum = Number(carros);
    const motosNum = Number(motos);

    if (carrosNum < 0 || motosNum < 0) {
      setError("Las cantidades deben ser mayores o iguales a 0");
      return;
    }

    if (carrosNum === 0 && motosNum === 0) {
      setError("Debe agregar al menos un espacio");
      return;
    }

    try {
      setLoading(true);

      await onSave({
        carros: carrosNum,
        motos: motosNum,
      });

      setCarros(0);
      setMotos(0);

      onClose();
    } catch (err) {
      setError("Error al agregar espacios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Espacios</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <Label>Espacios para carros</Label>
            <Input
              type="number"
              min="0"
              value={carros}
              onChange={(e) => setCarros(e.target.value)}
            />
          </div>

          <div>
            <Label>Espacios para motos</Label>
            <Input
              type="number"
              min="0"
              value={motos}
              onChange={(e) => setMotos(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Agregando..." : "Agregar"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
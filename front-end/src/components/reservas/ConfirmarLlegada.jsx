import { useState } from "react";

import { confirmarLlegada } from "../../api/reservas";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";

export default function ConfirmarLlegada() {

  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleConfirmar = async () => {
    try {

      setLoading(true);
      setError("");
      setSuccess("");

      await confirmarLlegada(codigo);

      setSuccess("Llegada confirmada correctamente");
      setCodigo("");

    } catch (err) {

      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Error confirmando llegada"
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <Card>

      <CardHeader>
        <CardTitle>
          Confirmar Llegada
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <Input
          placeholder="Ej: RES-00001"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <Button
          onClick={handleConfirmar}
          disabled={loading}
          className="w-full"
        >
          Confirmar Llegada
        </Button>

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

      </CardContent>

    </Card>

  );
}
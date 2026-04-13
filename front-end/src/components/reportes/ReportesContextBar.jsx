import { RefreshCw } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const GRANULARIDADES = [
  { value: "hora", label: "Hora" },
  { value: "dia", label: "Dia" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mes" },
];

export const ReportesContextBar = ({
  fechaDesde,
  fechaHasta,
  onFechaDesdeChange,
  onFechaHastaChange,
  usuarioSeleccionado = "TODOS",
  onUsuarioSeleccionadoChange,
  usuarios = [],
  granularidad = "dia",
  onGranularidadChange,
  onLimpiar,
  onActualizar,
  loading = false,
}) => {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
        <Input type="datetime-local" value={fechaDesde} onChange={(e) => onFechaDesdeChange(e.target.value)} />
        <Input type="datetime-local" value={fechaHasta} onChange={(e) => onFechaHastaChange(e.target.value)} />

        <Select value={usuarioSeleccionado} onValueChange={onUsuarioSeleccionadoChange}>
          <SelectTrigger>
            <SelectValue placeholder="Usuario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los usuarios</SelectItem>
            {usuarios.map((usuario) => (
              <SelectItem key={usuario.id} value={String(usuario.id)}>
                {usuario.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={granularidad} onValueChange={onGranularidadChange}>
          <SelectTrigger>
            <SelectValue placeholder="Granularidad" />
          </SelectTrigger>
          <SelectContent>
            {GRANULARIDADES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="md:col-span-2 flex items-center justify-end gap-2">
          <Button size="sm" variant="outline" onClick={onLimpiar} disabled={loading}>
            Limpiar
          </Button>
          <Button size="sm" onClick={onActualizar} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>
    </div>
  );
};

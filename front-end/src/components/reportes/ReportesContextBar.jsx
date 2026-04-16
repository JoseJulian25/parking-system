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
  showUsuarioFilter = true,
  showGranularidadFilter = true,
  usuarioSeleccionado = "TODOS",
  onUsuarioSeleccionadoChange,
  usuarios = [],
  granularidad = "dia",
  onGranularidadChange,
  granularidades = GRANULARIDADES,
  extraFilters = null,
  additionalFiltersCount = 0,
  onLimpiar,
  onActualizar,
  loading = false,
}) => {
  const midFilters = (showUsuarioFilter ? 1 : 0) + (showGranularidadFilter ? 1 : 0) + additionalFiltersCount;
  const gridColsClass = {
    0: "md:grid-cols-4",
    1: "md:grid-cols-5",
    2: "md:grid-cols-6",
    3: "md:grid-cols-7",
  }[midFilters] || "md:grid-cols-4";

  return (
    <div className="reportes-panel">
      <div className={`grid grid-cols-1 gap-2 md:gap-3 ${gridColsClass}`}>
        <div className="space-y-1">
          <label className="reportes-field-label">Desde</label>
          <Input
            type="datetime-local"
            className="h-9 text-xs"
            value={fechaDesde}
            onChange={(e) => onFechaDesdeChange(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="reportes-field-label">Hasta</label>
          <Input
            type="datetime-local"
            className="h-9 text-xs"
            value={fechaHasta}
            onChange={(e) => onFechaHastaChange(e.target.value)}
          />
        </div>

        {showUsuarioFilter && (
          <div className="space-y-1">
            <label className="reportes-field-label">Usuario</label>
            <Select value={usuarioSeleccionado} onValueChange={onUsuarioSeleccionadoChange}>
              <SelectTrigger className="h-9 text-xs">
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
          </div>
        )}

        {showGranularidadFilter && (
          <div className="space-y-1">
            <label className="reportes-field-label">Agrupar por</label>
            <Select value={granularidad} onValueChange={onGranularidadChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Granularidad" />
              </SelectTrigger>
              <SelectContent>
                {granularidades.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {extraFilters}

        <div className="md:col-span-2 flex items-end justify-end gap-2 pt-1">
          <Button size="sm" className="h-9 px-3 text-xs" variant="outline" onClick={onLimpiar} disabled={loading}>
            Limpiar
          </Button>
          <Button size="sm" className="h-9 px-3 text-xs" onClick={onActualizar} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>
    </div>
  );
};

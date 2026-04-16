import { RefreshCw } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const ReportesFiltrosBar = ({
  fechaDesde,
  fechaHasta,
  onFechaDesdeChange,
  onFechaHastaChange,
  onLimpiar,
  onActualizar,
  loading = false,
  children = null,
  columnsClassName = "md:grid-cols-4",
  actionsSpanClassName = "md:col-span-2",
}) => {
  return (
    <div className="reportes-panel">
      <div className={`grid grid-cols-1 gap-2 md:gap-3 ${columnsClassName}`}>
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

        {children}

        <div className={`${actionsSpanClassName} flex items-end justify-end gap-2 pt-1`}>
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

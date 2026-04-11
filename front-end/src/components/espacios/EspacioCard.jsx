import { Car, Bike, Settings, X } from 'lucide-react';

const getStatusStyles = (estado) => {
  const normEstado = typeof estado === 'string' ? estado.toUpperCase() : '';

  switch (normEstado) {
    case 'LIBRE':
      return {
        container: 'bg-emerald-100/80 border-emerald-300/80 text-emerald-900',
      };
    case 'OCUPADO':
      return {
        container: 'bg-rose-100/80 border-rose-300/80 text-rose-900',
      };
    case 'RESERVADO':
      return {
        container: 'bg-amber-100/80 border-amber-300/80 text-amber-900',
      };
    default:
      return {
        container: 'bg-slate-50/90 border-slate-200/90 text-slate-800',
      };
  }
};

export const EspacioCard = ({
  numero,
  estado,
  tipoVehiculo,
  onEdit,
  onDelete,
  canDelete = false,
  showActions = true,
}) => {
  const vehicleType = typeof tipoVehiculo === 'string' ? tipoVehiculo.toLowerCase() : '';
  const Icon = vehicleType === 'moto' ? Bike : Car;
  const statusStyles = getStatusStyles(estado);

  return (
    <div
      className={`relative group overflow-hidden rounded-lg border px-3 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${statusStyles.container}`}
    >
      {showActions && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={onEdit}
            className="rounded bg-slate-700/80 p-1 text-white"
            type="button"
          >
            <Settings className="w-4 h-4" />
          </button>
          {canDelete && (
            <button
              onClick={onDelete}
              className="rounded bg-rose-600/90 p-1 text-white"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="absolute bottom-2 right-2 opacity-40">
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>

      <div className="text-center pr-5">
        <p className="text-lg font-bold mb-1 leading-none">{numero}</p>
      </div>
    </div>
  );
};

export default EspacioCard;

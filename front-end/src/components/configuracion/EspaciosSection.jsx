import { Layers3, PlusCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { addEspaciosLote, deleteEspacio, getEspacios, getEspaciosInactivos, reactivarEspacio } from "../../api/espacios";
import AddEspaciosDialog from "../espacios/AddEspaciosDialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export const EspaciosSection = () => {
  const [espacios, setEspacios] = useState([]);
  const [espaciosInactivos, setEspaciosInactivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [categoria, setCategoria] = useState("total");

  const fetchEspacios = async () => {
    try {
      setLoading(true);
      const [activos, inactivos] = await Promise.all([getEspacios(), getEspaciosInactivos()]);
      setEspacios(Array.isArray(activos) ? activos : []);
      setEspaciosInactivos(Array.isArray(inactivos) ? inactivos : []);
    } catch (error) {
      toast.error("No se pudo cargar el inventario de espacios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspacios();
  }, []);

  const handleAgregarLote = async (payload) => {
    try {
      await addEspaciosLote(payload);
      toast.success("Espacios agregados correctamente");
      await fetchEspacios();
    } catch (error) {
      const message = error?.response?.data?.message || "No se pudieron agregar espacios";
      toast.error(message);
      throw error;
    }
  };

  const handleDesactivar = async (espacio) => {
    if (!espacio?.id) return;
    if (String(espacio.estado || "").toUpperCase() !== "LIBRE") {
      toast.error("Solo se pueden desactivar espacios en estado LIBRE");
      return;
    }

    const confirmed = window.confirm(`Desactivar ${espacio.codigoEspacio}? Se marcara como activo=0.`);
    if (!confirmed) return;

    try {
      setLoadingActionId(espacio.id);
      await deleteEspacio(espacio.id);
      toast.success("Espacio desactivado (activo=0)");
      await fetchEspacios();
    } catch (error) {
      const message = error?.response?.data?.message || "No se pudo desactivar el espacio";
      toast.error(message);
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleReactivar = async (espacio) => {
    if (!espacio?.id) return;
    try {
      setLoadingActionId(espacio.id);
      await reactivarEspacio(espacio.id);
      toast.success("Espacio reactivado (activo=1)");
      await fetchEspacios();
    } catch (error) {
      const message = error?.response?.data?.message || "No se pudo reactivar el espacio";
      toast.error(message);
    } finally {
      setLoadingActionId(null);
    }
  };

  const resumen = useMemo(() => {
    const libres = espacios.filter((espacio) => String(espacio.estado || "").toUpperCase() === "LIBRE").length;
    const carros = espacios.filter((espacio) => String(espacio.tipoVehiculo || "").toUpperCase() === "CARRO").length;
    const motos = espacios.filter((espacio) => String(espacio.tipoVehiculo || "").toUpperCase() === "MOTO").length;

    return {
      total: espacios.length,
      libres,
      carros,
      motos,
      inactivos: espaciosInactivos.length,
    };
  }, [espacios, espaciosInactivos]);

  const espaciosFiltrados = useMemo(() => {

  if (categoria === "carros") {
    return espacios.filter(e => 
      String(e.tipoVehiculo).toUpperCase() === "CARRO"
    );
  }

  if (categoria === "motos") {
    return espacios.filter(e => 
      String(e.tipoVehiculo).toUpperCase() === "MOTO"
    );
  }

  if (categoria === "libres") {
    return espacios.filter(e => 
      String(e.estado).toUpperCase() === "LIBRE"
    );
  }

  if (categoria === "inactivos") {
    return espaciosInactivos;
  }

  return espacios;

  }, [categoria, espacios, espaciosInactivos]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Layers3 className="h-5 w-5" />
            Gestión de Espacios
          </CardTitle>
          <Button onClick={() => setOpenAddDialog(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar lote
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Aquí se gestiona capacidad y activación lógica (activo=0/1). El estado operativo del parqueo se controla por el flujo normal del sistema.
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer" onClick={() => setCategoria("total")}>
              Total: {resumen.total}
            </Badge>

            <Badge variant="outline" className="cursor-pointer" onClick={() => setCategoria("carros")}>
              Carros: {resumen.carros}
            </Badge>

            <Badge variant="outline" className="cursor-pointer" onClick={() => setCategoria("motos")}>
              Motos: {resumen.motos}
            </Badge>

            <Badge variant="outline" className="cursor-pointer" onClick={() => setCategoria("libres")}>
              Libres: {resumen.libres}
            </Badge>

            <Badge variant="outline" className="cursor-pointer" onClick={() => setCategoria("inactivos")}>
              Inactivos: {resumen.inactivos}
            </Badge>
          </div>

          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="h-9 px-2">Código</TableHead>
                <TableHead className="h-9 px-2">Tipo</TableHead>
                <TableHead className="h-9 px-2">Estado</TableHead>
                <TableHead className="h-9 px-2">Activo</TableHead>
                <TableHead className="h-9 px-2 text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-xs text-muted-foreground">
                    Cargando espacios...
                  </TableCell>
                </TableRow>
              ) : !espacios.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-xs text-muted-foreground">
                    No hay espacios registrados.
                  </TableCell>
                </TableRow>
              ) : (
                espaciosFiltrados.slice(0, 80).map((espacio) => (
                  <TableRow key={espacio.id}>
                    <TableCell className="px-2 py-2 font-medium">{espacio.codigoEspacio || espacio.numero || "-"}</TableCell>
                    <TableCell className="px-2 py-2">{espacio.tipoVehiculo || "-"}</TableCell>
                    <TableCell className="px-2 py-2">{espacio.estado || "-"}</TableCell>
                    <TableCell className="px-2 py-2">
                      <Badge variant="outline" className="border-emerald-300 text-emerald-700">Sí</Badge>
                    </TableCell>
                    <TableCell className="px-2 py-2 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={loadingActionId === espacio.id || String(espacio.estado || "").toUpperCase() !== "LIBRE"}
                        onClick={() => handleDesactivar(espacio)}
                      >
                        {loadingActionId === espacio.id ? "Procesando..." : "Desactivar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {espacios.length > 80 ? (
            <p className="text-xs text-muted-foreground">Mostrando 80 de {espacios.length} espacios.</p>
          ) : null}

          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="h-9 px-2">Inactivos</TableHead>
                <TableHead className="h-9 px-2">Tipo</TableHead>
                <TableHead className="h-9 px-2">Estado</TableHead>
                <TableHead className="h-9 px-2">Activo</TableHead>
                <TableHead className="h-9 px-2 text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!espaciosInactivos.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-4 text-center text-xs text-muted-foreground">
                    No hay espacios inactivos.
                  </TableCell>
                </TableRow>
              ) : (
                espaciosInactivos.map((espacio) => (
                  <TableRow key={`inactivo-${espacio.id}`}>
                    <TableCell className="px-2 py-2 font-medium">{espacio.codigoEspacio || espacio.numero || "-"}</TableCell>
                    <TableCell className="px-2 py-2">{espacio.tipoVehiculo || "-"}</TableCell>
                    <TableCell className="px-2 py-2">{espacio.estado || "-"}</TableCell>
                    <TableCell className="px-2 py-2">
                      <Badge variant="outline" className="border-rose-300 text-rose-700">No</Badge>
                    </TableCell>
                    <TableCell className="px-2 py-2 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={loadingActionId === espacio.id}
                        onClick={() => handleReactivar(espacio)}
                      >
                        {loadingActionId === espacio.id ? "Procesando..." : "Reactivar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddEspaciosDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSave={handleAgregarLote}
      />
    </div>
  );
};

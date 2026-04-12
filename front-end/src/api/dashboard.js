import client from "./client";

export const getMovimientosHoy = async () => {
  const { data } = await client.get("/dashboard/movimientos-hoy");
  return data;
};

import client from "./client";

export const registrarEntradaVehiculo = async (payload) => {
  const { data } = await client.post("/entradas", payload);
  return data;
};
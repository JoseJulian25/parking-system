import client from "./client";

export const getResumenSalidaPorEspacio = async (espacioId) => {
  const { data } = await client.get(`/salidas/espacio/${espacioId}/resumen`);
  return data;
};

export const procesarCobroSalida = async (payload) => {
  const { data } = await client.post("/salidas/cobro", payload);
  return data;
};

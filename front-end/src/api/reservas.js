import client from "./client";

export const crearReserva = async (payload) => {
  const { data } = await client.post("/reservas", payload);
  return data;
};

export const buscarReservaPorCodigo = async (codigo) => {
  const { data } = await client.get(`/reservas/${codigo}`);
  return data;
};

export const confirmarLlegada = async (codigoReserva) => {
  const { data } = await client.patch(`/reservas/${codigoReserva}/estado`, {
    estado: "ACTIVA"
  });
  return data;
};


export const registrarSalida = async (codigo) => {
  const { data } = await client.patch(`/reservas/${codigo}/estado`, {
    estado: "FINALIZADA"
  });
  return data;
};

export const getReservas = async () => {
  const { data } = await client.get("/reservas");
  return data;
};

export const cancelarReserva = async (codigoReserva) => {
  const { data } = await client.patch(`/reservas/${codigoReserva}/estado`, {
    estado: "CANCELADA"
  });
  return data;
};
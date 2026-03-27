import client from "./client";

export const getEspacios = async () => {
  const { data } = await client.get("/espacios");
  return data;
};

export const updateEstadoEspacio = async (id, estado) => {
  const { data } = await client.patch(`/espacios/${id}/estado`, { estado });
  return data;
};

export const addEspaciosLote = async (data) => {
  try {
    const response = await client.post("/espacios/lote", data);
    console.log(response)
    return response.data;
  } catch (error) {
    throw error;
    console.log(error);
  }
};

export const deleteEspacio = async (id) => {
  const { data } = await client.delete(`/espacios/${id}`);
  return data;
};
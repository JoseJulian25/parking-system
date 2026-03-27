import client from "./client";

export const getEspacios = async () => {
  const { data } = await client.get("/espacios");
  return data;
};

export const updateEstadoEspacio = async (id, estado) => {
  try {
    const { data } = await client.patch(`/espacios/${id}/estado`, { estado });
    console.log(data)
    return data;
  } catch (error) {
    console.log("Error updateEstadoEspacio:", error.response?.data || error.message);
    throw error;
  }
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
  try {
    const { data } = await client.delete(`/espacios/${id}`);
    return data;
  } catch (error) {
    console.log("Error deleteEspacio:", error.response?.data || error.message);
    throw error;
  }
};
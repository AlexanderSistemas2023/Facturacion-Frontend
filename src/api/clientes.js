import { showAlertError, showAlertExito } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const clientes = 'clients';

// obteniendo los datos del negocio
export const listClientData = async () => {
  try {
    const response = await axiosInstance.post(`/${clientes}/data`);
    return response.data;
  } catch (error) {
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};


// actualizando datos del cliente
export const updateCliente = async (data) => {
  try {
    const response = await axiosInstance.post(`/${clientes}/update`, data);
    showAlertExito("¡Éxito!", "Datos de configuración actualizada exitosamente");
    return response.data;
  } catch (error) {
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};


// actualizando datos del cliente
export const createCliente = async (data) => {
  try {
    const response = await axiosInstance.post(`/${clientes}/registro`, data);
    showAlertExito("¡Éxito!", "Datos del negocio creado exitosamente");
    return response.data;
  } catch (error) {
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};




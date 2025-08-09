import { showAlertError /*,  showAlertExito */ } from '../utils/alertHelper';
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
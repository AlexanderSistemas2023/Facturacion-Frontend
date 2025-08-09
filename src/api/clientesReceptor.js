import { showAlertError ,  showAlertExito  } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const clienteReceptor = 'receptor';

// Listando los clientes receptores
export const listClienteReceptor = async () => {
  try {
    const response = await axiosInstance.get(`/${clienteReceptor}/list`);
    return response.data;
  } catch (error) {
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};

// Actualizar cliente receptor
export const createClienteReceptor = async ( data) => {
    try {
        const response = await axiosInstance.post(`/${clienteReceptor}/create`, data );
        showAlertExito("¡Éxito!", "Cliente creado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};


// Actualizar cliente receptor
export const updateClienteReceptor = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/${clienteReceptor}/edit/${id}`, data );
        showAlertExito("¡Éxito!", "Cliente actualizado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};


// Actualizar cliente receptor
export const changeClienteReceptor = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/${clienteReceptor}/change/${id}`, data );
        showAlertExito("¡Éxito!", "Estado actualizado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};


import { showAlertError ,  showAlertExito  } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const provider = 'provider';

// Listando los proveedores
export const listProveedor = async () => {
  try {
    const response = await axiosInstance.get(`/${provider}/list`);
    return response.data;
  } catch (error) {
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};

// Crear proveedor
export const createProveedor = async ( data) => {
    try {
        const response = await axiosInstance.post(`/${provider}/create`, data );
        showAlertExito("¡Éxito!", "Proveedor creado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};


// Actualizar proveedor
export const updateProveedor = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/${provider}/edit/${id}`, data );
        showAlertExito("¡Éxito!", "Proveedor actualizado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};


// Actualizar estado del proveedor
export const changeProveedor = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/${provider}/change/${id}`, data );
        showAlertExito("¡Éxito!", "Estado actualizado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};


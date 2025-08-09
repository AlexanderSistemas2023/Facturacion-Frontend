import { showAlertError, showAlertExito } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const usuarios = 'usuarios';

// listando usuarios
export const listUsuarios = async (data) => {
    try {
        const response = await axiosInstance.get(`/${usuarios}/list`, { params: data });
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// Crear nueva suarios
export const createUsuarios = async ( data) => {
    try {
       const response = await axiosInstance.post(`/${usuarios}/create`, data);
       showAlertExito("¡Éxito!", "usuario creado exitosamente");
       return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// Actualizar usuario
export const updateUsuarios = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/${usuarios}/edit/${id}`, data );
        showAlertExito("¡Éxito!", "Usuario actualizado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// Cambiar estado usuario
export const changeUsuarios = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/${usuarios}/change/${id}`, data );
        showAlertExito("¡Éxito!", "Estado actualizado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

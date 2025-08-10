import { showAlertError ,showAlertExito } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const permisomodulos = 'permisomodulos';

// listando permisos por modulos
export const listPermisosModulos = async () => {
    try {
        const response = await axiosInstance.get(`/${permisomodulos}/list`);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// creado permisos por modulos
export const createPermisosModulos = async (data) => {
    try {
        const response = await axiosInstance.post(`/${permisomodulos}/create`,data);
        showAlertExito("¡Éxito!", "Modulo agregado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};


// eliminando permisos por modulos
export const deletePermisosModulos = async (id) => {
    try {
        const response = await axiosInstance.delete(`/${permisomodulos}/delete/${id}`);
        showAlertExito("¡Éxito!", response.data.msg);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};



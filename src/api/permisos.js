import { showAlertError ,showAlertExito  } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const permisos = 'permisos';

// listando permisos
export const listPermisos = async () => {
    try {
        const response = await axiosInstance.get(`/${permisos}/list`);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};



// lagregando permisos 
export const createPermisos = async (data) => {
    try {
        const response = await axiosInstance.post(`/${permisos}/create`, data);
         showAlertExito("¡Éxito!", "Permiso agregado exitosamente, ¡Ahora ya puede agregar los modulos! ");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};


// Agregnago infraestructura de permisos desde el formulario de registro
export const createPermisosForm = async (data) => {
    try {
        const response = await axiosInstance.post(`/${permisos}/createpermisoform`, data);
         showAlertExito("¡Éxito!", "Permiso agregado exitosamente, ¡Ahora ya puede agregar los modulos! ");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};



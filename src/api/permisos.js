import { showAlertError /*,   showAlertExito */ } from '../utils/alertHelper';
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
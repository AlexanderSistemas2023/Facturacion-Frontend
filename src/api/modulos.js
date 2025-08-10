import { showAlertError /*,   showAlertExito */ } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const modulos = 'modulos';

// listando modulos
export const listModulos = async () => {
    try {
        const response = await axiosInstance.get(`/${modulos}/list`);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};
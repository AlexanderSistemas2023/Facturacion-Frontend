import { showAlertError , showAlertExito, showAlertInfo } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const ingresos = 'ingresos';

// listando Ingresos
export const listIngresos = async () => {
    try {
        const response = await axiosInstance.get(`/${ingresos}/list`);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// listando Ingresos lazy
export const listIngresosLazy = async (page, limit, buscar) => {
    try {
        const response = await axiosInstance.get(`/${ingresos}/lazy/3/${page}/${limit}/${buscar}`);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// listando Ingresos
export const AddIngresos = async (data) => {
    try {
        const response = await axiosInstance.post(`/${ingresos}/add`, data);
        if (response.data.estado === 0){
            showAlertInfo("Verificar datos", response.data.msg);  
        }else{
           showAlertExito("¡Éxito!", "Ingreso de producto creado exitosamente");
        }
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};
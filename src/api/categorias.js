import { showAlertError, showAlertExito } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const categorias = 'categorias';

// listando categorias de los productos
export const listCategorias = async (data) => {
    try {
        const response = await axiosInstance.get(`/${categorias}/list`, { params: data });
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// Crear nueva categoría
export const createCategorias = async ( data) => {
    try {
       const response = await axiosInstance.post(`/${categorias}/create`, data);
       showAlertExito("¡Éxito!", "Categoria creada exitosamente");
       return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// Actualizar categoría
export const updateCategorias = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/${categorias}/edit/${id}`, data );
        showAlertExito("¡Éxito!", "Categoria actualizada exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// Cambiar estado categoría
export const changeCategorias = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/${categorias}/change/${id}`, data );
        showAlertExito("¡Éxito!", "Estado actualizado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

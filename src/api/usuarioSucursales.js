import { showAlertError , showAlertExito,showAlertInfo } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const usuariosSucursales = 'usuariosucursales';


// listando acceso de usuario
export const listAcceso = async () => {
    try {
        const response = await axiosInstance.get(`/${usuariosSucursales}/list`);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// listando acceso de usuario
export const listUsuariosAcceso = async (id_usuario) => {
    try {
        const response = await axiosInstance.get(`/${usuariosSucursales}/list/${id_usuario}`);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// editando acceso del usuario
export const editUsuariosAcceso = async (id,data) => {
    try {
        const response = await axiosInstance.put(`/${usuariosSucursales}/edit/${id}`,data);
        if (response.data.estado === 0)
           showAlertInfo("Verificar datos", response.data.msg);  
           showAlertExito("¡Éxito!", "Permiso de usuario actualizado exitosamente");
           return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde."+ error);
    }
};

// creando acceso del usuario
export const createUsuariosAcceso = async (data) => {
    try {
        const response = await axiosInstance.post(`/${usuariosSucursales}/create`, data);
        if (response.data.estado === 0){
           showAlertInfo("Verificar datos", response.data.msg);  
        }
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde."+ error);
    }
};

// Cambiar estado acceso de usuario
export const changeUsuariosAcceso = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/${usuariosSucursales}/change/${id}`, data );
        if (response.data.estado === 0)
           showAlertInfo("Verificar datos", response.data.msg);  
           showAlertExito("¡Éxito!", "Estado actualizado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};


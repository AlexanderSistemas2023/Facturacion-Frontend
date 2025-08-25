import { showAlertError, showAlertExito } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const sucursales = 'sucursales';

// listando las sucursales
export const listSucursales = async (data) => {
  const response = await axiosInstance.get(`/${sucursales}/list`, {
    params: data,
  });
  return response.data;
};

// Crear nueva sucursal
export const createSucursales = async (data) => {
  try {
     const response = await axiosInstance.post(`/${sucursales}/create`, data);
     return response.data;
  } catch (error) {
    
  }
 
};


// Crear nueva sucursal desde el formulario de registro
export const createFormSucursales = async (data) => {
  try {
     const response = await axiosInstance.post(`/${sucursales}/createform`, data);
     return response.data;
  } catch (error) {
    
  }
};



// Actualizar sucursal
export const updateSucursales = async (id,data) => {
  try {
    const response = await axiosInstance.put(`/${sucursales}/edit/${id}`, data);
     showAlertExito("¡Éxito!", "Sucursal actualizada exitosamente");
    return response.data;
  } catch (error) {
      showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
  
};





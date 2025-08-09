import axiosInstance from "./axiosInstance";
import { showAlertError, showAlertExito } from '../utils/alertHelper';

const productos = 'productos';

// listando productos
export const listProductos = async (data) => {
  try {
    const response = await axiosInstance.get(`/${productos}/list/2`, { params: data,});
    return response.data;
  } catch (error) {
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};

// agregando nuevos productos
export const createProductos = async (data) => {
  try {
     const response = await axiosInstance.post(`/${productos}/create`,data);
      showAlertExito("¡Éxito!", "Producto creado exitosamente");
      return response.data;
  } catch (error) {
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};

// agregando nuevos productos
export const updateProducto = async (id, data) => {
  try {
     const response = await axiosInstance.put(`/${productos}/edit/${id}`,data);
      showAlertExito("¡Éxito!", "Producto actualizado exitosamente");
      return response.data;
  } catch (error) {
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};








import axiosInstance from "./axiosInstance";
import { showAlertError, showAlertExito } from '../utils/alertHelper';

export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post(`/clients/login`, data);
    const { token } = response.data;
    sessionStorage.setItem("token", token);
    showAlertExito("¡Éxito!", "La acción se realizó correctamente");
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    if (error.response && error.response.status === 400) {
      const msg = error.response.data?.msg || "Error en la solicitud.";
      showAlertError("Error de autenticación", msg);
    } else {
      showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
  }
};

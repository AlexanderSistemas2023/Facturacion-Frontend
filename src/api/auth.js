import axiosInstance from "./axiosInstance";
import { showAlertError, showAlertExito , showAlertInfo} from '../utils/alertHelper';

export const loginUser = async (data) => {
  try {

    const response = await axiosInstance.post(`/clients/login`, data);
    const { token } = response.data;
     if (!token) {
      showAlertInfo("Elige una sucursal", "Debe seleccionar una sucursal para continuar.");
    } else {
      sessionStorage.setItem("token", token);
      showAlertExito("¡Éxito!", "La acción se realizó correctamente");
    }
    return response.data;
  } catch (error) {

    if (error.response && error.response.status === 400) {
      const msg = error.response.data?.msg || "Error en la solicitud.";
      showAlertError("Error de autenticación", msg);
    } else {
      showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }

  }
};

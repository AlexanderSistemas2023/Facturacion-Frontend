import { showAlertError /* ,showAlertExito, showAlertInfo */} from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const facturar = 'facturar';

// listando Facturaciones lazy
export const listFacturacionesLazy = async (page, limit, buscar) => {
    try {
        const response = await axiosInstance.get(`/${facturar}/lazy/3/${page}/${limit}/${buscar}`);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};
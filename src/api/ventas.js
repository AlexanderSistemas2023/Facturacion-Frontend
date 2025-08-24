import { showAlertError ,showAlertExito, showConfirmAlert /* showAlertInfo */ } from '../utils/alertHelper';
import axiosInstance from "./axiosInstance";

const facturar = 'facturar';

// listando Facturaciones lazy
export const listFacturacionesLazy = async (page, limit, buscar) => {
    try {
        const response = await axiosInstance.get(`/${facturar}/lazy/2/${page}/${limit}/${buscar}`);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// facturacion comprobante credito fiscal
export const FacturacionCCF = async (data) => {
    try {
        const response = await axiosInstance.post(`/${facturar}/ccf`,data);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// Anulacion de comprobante
export const Anulacion = async (data) => {
    try {
        const response = await axiosInstance.post(`/${facturar}/anulacion`,data);
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// firmado de documentos tributarios
export const Firmador = async (data) => {
    try {
        const response = await axiosInstance.post(`/${facturar}/firmador`,data);
         showAlertExito("¡Éxito!", "Documento firmado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// Presentando facturacion a hacienda
export const presentacionHacienda = async (data, dteSerial) => {
    try {
        const confirmar = await showConfirmAlert(
            "¿Deseas presentar el documento?",
            `Esta acción enviará la factura a Hacienda<br><strong>${dteSerial}</strong>`,
        );

        if (!confirmar) return; 

        const response = await axiosInstance.post(`/${facturar}/presentacion_hacienda`, data);
         showAlertExito("¡Éxito!", "Documento presentado en hacienda exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};

// firmado de documentos tributarios
export const Token = async (data) => {
    try {
        const response = await axiosInstance.post(`/${facturar}/firmador`,data);
         showAlertExito("¡Éxito!", "Documento firmado exitosamente");
        return response.data;
    } catch (error) {
        showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
    }
};
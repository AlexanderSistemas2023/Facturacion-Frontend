import axiosInstance from "./axiosInstance";
import { showAlertError } from '../utils/alertHelper';

const catalogo = "dtecatalogo";

// listando los ambientes
export const listAmbiente001 = async () => {
  try {
    const response = await axiosInstance.get(`/${catalogo}/dte_ambientes`);
    return response.data;
  } catch (error) {
    console.error("Error en listar tipo de ambiente:", error);
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};


// listando tipo de documento
export const listTipoDocumento002 = async () => {
  try {
    const response = await axiosInstance.get(`/${catalogo}/dte_tipo_documento`);
    return response.data;
  } catch (error) {
    console.error("Error en listar tipo de documentos:", error);
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};


// listando los tipos de establecimientos
export const listTipoEstablecimiento009 = async () => {
  try {
    const response = await axiosInstance.get(`/${catalogo}/dte_tipo_establecimiento`);
    return response.data;
  } catch (error) {
    console.error("Error en listar tipo de establecimiento:", error);
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};


// listando tipo de item
export const listTipoItem011 = async () => {
  try {
    const response = await axiosInstance.get(`/${catalogo}/dte_tipo_item`);
    return response.data;
  } catch (error) {
    console.error("Error en listar Tipo de Item:", error);
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};


// listando departamentos
export const listDepartamento012 = async () => {
  try {
    const response = await axiosInstance.get(`/${catalogo}/dte_departamento`);
    return response.data;
  } catch (error) {
    console.error("Error en listar los departamentos:", error);
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};


// listando municipios
export const listMunicipio013 = async () => {
  try {
    const response = await axiosInstance.get(`/${catalogo}/dte_municipio`);
    return response.data;
  } catch (error) {
    console.error("Error en listar los Municipios:", error);
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};


// listando unidad de medida
export const listUnidadMedida014 = async () => {
  try {
    const response = await axiosInstance.get(`/${catalogo}/dte_unidad_medida`);
    return response.data;
  } catch (error) {
    console.error("Error en listar Unidad de medida:", error);
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};


// listando tipos de tributos
export const listTributo015 = async () => {
  try {
    const response = await axiosInstance.get(`/${catalogo}/dte_tributo`);
    return response.data;
  } catch (error) {
    console.error("Error en listar tributos:", error);
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};



// listando actividad economica
export const listActividadEconomica19 = async () => {
  try {
    const response = await axiosInstance.get(`/${catalogo}/dte_codigo_actividad_economica`);
    return response.data;
  } catch (error) {
    console.error("Error en listar Activdad Economica:", error);
    showAlertError("Error inesperado", "Ocurrió un problema, intenta más tarde.");
  }
};




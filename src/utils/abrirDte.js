const API_VISTA_DTE = process.env.REACT_APP_VISTA_URL;

export function abrirDte(codGeneration) {
  const url = `${API_VISTA_DTE}/?codGeneration=${codGeneration}`;
  window.open(url, "_blank");
}
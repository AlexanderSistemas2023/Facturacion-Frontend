// Extrayendo sello de recepcion
export const selloRecepcion = (data) => {
  if (!data) return "";

  let parsed;
  try {
    parsed = typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("❌ Error al parsear JSON:", error);
    return "";
  }

  return parsed.selloRecibido ? parsed.selloRecibido : "";
};
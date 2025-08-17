export const formatDUI = (value) => {
  if (!value) return "";
  // Eliminar todo lo que no sean números
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 8) {
    return digits; // todavía escribiendo la parte izquierda
  }
  return digits.slice(0, 8) + "-" + digits.slice(8, 9);
};
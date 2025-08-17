import Swal from 'sweetalert2';

// Valida que el objeto ingresoData esté completo
export const DataIngreso = (data) => {
  let errores = [];

  // Validar campos obligatorios de nivel raíz
  if (!data.codigo_factura) errores.push("Codigo de Factura");
  if (!data.numero_factura) errores.push("Numero de factura");
  if (!data.id_proveedor) errores.push("Proveedor");
  if (!data.fecha_ingreso) errores.push("Fecha Ingreso");
  if (!data.id_typeFacts) errores.push("Tipo de factura");

  // Validar detalle
  if (!Array.isArray(data.ingresoDetalle) || data.ingresoDetalle.length === 0) {
    errores.push("Agregar al menos 1 producto ");
  } else {
    data.ingresoDetalle.forEach((item, index) => {
      if (!item.id_producto) errores.push(`Seleccionar un producto`);
      if (!item.cantidad || item.cantidad <= 0) {
        errores.push(`Producto debe llevar cantidad valida`);
      }
    });
  }

  // Mostrar errores si existen
  if (errores.length > 0) {
    Alertas("Campos incompletos", `${errores.join("<br>")}`);
    return false;
  }

  // ✅ Si pasa todas las validaciones
  return true;
};

// 🔹 Función auxiliar para mostrar alertas
function Alertas(title, html) {
  Swal.fire({
    title,
    html,
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

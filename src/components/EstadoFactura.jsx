const EstadoFactura = ({ status }) => {
  // Convertimos a número por si viene como string
  const estado = Number(status);

  // Definimos texto y colores según estado
  let texto = "";
  let bgColor = "";
  let textColor = "";

  switch (estado) {
    case 0:
      texto = "Error en datos";
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    case 1:
      texto = "Pendiente de firmar";
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case 2:
      texto = "Pendiente de envío";
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case 3:
      texto = "Presentado";
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case 4:
      texto = "Invalidado";
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      break;
    case 5:
      texto = "Presentado con observaciones";
      bgColor = "bg-orange-100";
      textColor = "text-orange-800";
      break;
    case 6:
      texto = "Observado";
      bgColor = "bg-orange-100";
      textColor = "text-orange-800";
      break;
    case 7:
      texto = "Rechazado";
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    default:
      texto = "Desconocido";
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      break;
  }

  return (
   <span
      className={`inline-block w-25 text-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
    >
      {texto}
    </span>
  );
};

export default EstadoFactura;

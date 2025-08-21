const Procedencia = ( status ) => {
  // status === 0 -> Interno
  // status === 1 -> Uso Api

  const isInterno = status === 1;

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isInterno ? "bg-green-100 text-green-800" : "bg-yellow-100 text-red-800"
      }`}
    >
      {isInterno ? "Interno" : "Uso Api"}
    </span>
  );
};

export default Procedencia;

import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { listModulosLazy  } from "../api/modulos";

const Modulos = () => {
  const [loading, setLoading] = useState(true);
  const [modulos, setModulos] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [buscar, setBuscar] = useState("");

  // Obtener modulos
  const fetchData = async (p = 1) => {
    try {
      const data = await listModulosLazy(p, limit, buscar);
      setModulos(data.data);

      setTotalPages(data.totalPages);
      setPage(data.currentPage);

    } catch (error) {
      console.error("Error al obtener las modulos", error);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    fetchData(page);
     // eslint-disable-next-line 
  }, [page, limit, buscar]);

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Modulos del sistema</h2>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="border rounded px-3 py-1 w-64"
        />
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border rounded px-3 py-1"
        >
          {[10, 15, 25, 50, 100, 250, 500, 1000].map((num) => (
            <option key={num} value={num}>
              {num} por página
            </option>
          ))}
        </select>
      </div>


      {/* Tabla de modulos */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {modulos.map((modulo, index) => (
              <tr
                key={modulo.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-200"
                } hover:bg-blue-200`}
              >
                <td className="px-4 py-2 border">{modulo.modulo}</td>
                <td className="px-4 py-2 border">{modulo.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  {/* Paginación */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => fetchData(page - 1)}
          className={`px-3 py-1 border rounded ${
            page === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => fetchData(num)}
            className={`px-3 py-1 border rounded ${
              page === num
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => fetchData(page + 1)}
          className={`px-3 py-1 border rounded ${
            page === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Siguiente
        </button>
      </div>


    </div>
  );
};

export default Modulos;

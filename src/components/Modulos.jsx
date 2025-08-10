import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { listModulos } from "../api/modulos";

const Modulos = () => {
  const [loading, setLoading] = useState(true);
  const [modulos, setModulos] = useState([]);

  // Obtener categorías
  const fetchModulos = async () => {
    try {
      const data = await listModulos({});
      setModulos(data.data);

    } catch (error) {
      console.error("Error al obtener las categorías", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModulos();
  }, []);



  if (loading) return <Loader />;

  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Modulos del sistema</h2>
      </div>

      {/* Tabla de categorías */}
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

    </div>
  );
};

export default Modulos;

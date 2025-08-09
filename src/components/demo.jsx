import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { listCategorias } from "../api/categorias";
import Loader from "../components/Loader";

const Categorias = () => {
   const [loading, setLoading] = useState(true);
   const [categorias, setCategorias] = useState([]);


 useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listCategorias ({});
        setCategorias(data.data);
      } catch (error) {
        console.error("Error al obtener las categorias", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


   if (loading) return <Loader />;

   return (
    <div>
      <h2>Ventas</h2>
      <p>Aquí puedes listar, agregar o editar productos.</p>
    </div>
  );
}

export default Categorias;
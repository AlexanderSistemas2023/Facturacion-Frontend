import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import {
  listDepartamento012,
  listMunicipio013,
  listTipoEstablecimiento009,
} from "../api/hacienda";
import { listClientData } from "../api/clientes";
import { listSucursales, updateSucursales } from "../api/sucursales";
import Loader from "../components/Loader";
import { FiEdit3, FiSave } from "react-icons/fi";

const bgColors = [
  "bg-red-200",
  "bg-blue-200",
  "bg-red-200",
  "bg-blue-200",
  "bg-red-200",
  "bg-blue-200",
  "bg-red-200",
];

const Sucursales = () => {
  const [loading, setLoading] = useState(true);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [establecimiento, setEstablecimientos] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [sucursalesEdit, setSucursales] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [updatingIndex, setUpdatingIndex] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const dep = await listDepartamento012({});
        setDepartamentos(dep.data);

        const mun = await listMunicipio013({});
        setMunicipios(mun.data);

        const suc = await listSucursales({});
        setSucursales(suc.data);

        const est = await listTipoEstablecimiento009({});
        setEstablecimientos(est.data);

        const clienteData = await listClientData();
        setCliente(clienteData.data);

      } catch (error) {
        console.error("Error al obtener datos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSucursalChange = (index, field, value) => {
    const updated = [...sucursalesEdit];
    updated[index][field] = value;
    setSucursales(updated);
  };

  const handleEditClick = async (index) => {
  if (editingIndex === index) {
    // Está en modo edición, así que guardamos
    const sucursal = sucursalesEdit[index];
    const data = {
      nombre: sucursal.nombre,
      codigo_sucursal: sucursal.codigo_sucursal,
      id_typeSucursalFacts: sucursal.id_typeSucursalFacts,
      id_departamento: sucursal.id_departamento,
      id_municipio: sucursal.id_municipio,
      telefono: sucursal.telefono,
      correo: sucursal.correo,
      direccion: sucursal.direccion,
    };

    setUpdatingIndex(index); // Mostrar botón "Actualizando..."

    try {
      await updateSucursales(sucursal.id, data);
      setEditingIndex(null); // Desactiva edición
    } catch (error) {
      console.error("Error al actualizar", error);
    } finally {
      setUpdatingIndex(null); // Oculta spinner
    }
  } else {
    // Activar modo edición
    setEditingIndex(index);
  }
};


  const isEditing = (index) => editingIndex === index;

  if (loading || !cliente) return <Loader />;

  const opcionesDepartamentos = departamentos.map((d) => ({
    value: d.id,
    label: `${d.codigo} | ${d.name}`,
  }));

  const opcionesMunicipios = municipios.map((m) => ({
    value: m.id,
    label: `${m.codigo} | ${m.name}`,
  }));

  const opcionesEstablecimiento = establecimiento.map((es) => ({
    value: es.id,
    label: `${es.codigo} | ${es.name}`,
  }));

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6 p-6">
      <h2 className="text-xl font-semibold mb-4">Sucursales</h2>
      {sucursalesEdit.map((sucursal, index) => {
        const selectedDep = opcionesDepartamentos.find(
          (d) => d.value === sucursal.id_departamento
        );
        const selectedMun = opcionesMunicipios.find(
          (m) => m.value === sucursal.id_municipio
        );
        const selectedEst = opcionesEstablecimiento.find(
          (es) => es.value === sucursal.id_typeSucursalFacts
        );

        const bgColor = bgColors[index % bgColors.length];

        return (
          <div
            key={sucursal.id}
            className={`${bgColor} border border-gray-300 p-4 rounded mb-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sucursal #{index + 1}</h3>
              {updatingIndex === index ? (
            // Mostrar spinner mientras actualiza
               <button 
                    type="button"
                    className="flex items-center gap-2 px-3 py-1 text-sm rounded text-white bg-green-600"
                    disabled
                   >
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Actualizando...
               </button>
              ) : (
           // Mostrar botón normal si no está actualizando
              <button
                    type="button"
                    onClick={() => handleEditClick(index)}
                    className={`flex items-center gap-2 px-3 py-1 text-sm rounded text-white ${
                    isEditing(index) ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                   {isEditing(index) ? <FiSave /> : <FiEdit3 />}
                   {isEditing(index) ? "Guardar" : "Habilitar Edición"}
               </button>
               )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Sucursal", key: "nombre" },
                { label: "Dirección", key: "direccion" },
                { label: "Teléfono", key: "telefono" },
                { label: "Correo", key: "correo" },
                { label: "Código Sucursal", key: "codigo_sucursal" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block mb-1 font-medium">{label}</label>
                  <input
                    type="text"
                    value={sucursal[key]}
                    onChange={(e) =>
                      handleSucursalChange(index, key, e.target.value)
                    }
                    className="w-full border rounded px-3 py-2"
                    disabled={!isEditing(index)}
                  />
                </div>
              ))}

              <div>
                <label className="block mb-1 font-medium">Departamento</label>
                <ReactSelect
                  options={opcionesDepartamentos}
                  value={selectedDep}
                  onChange={(selected) =>
                    handleSucursalChange(
                      index,
                      "id_departamento",
                      selected ? selected.value : null
                    )
                  }
                  isClearable
                  isSearchable
                  isDisabled={!isEditing(index)}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Establecimiento</label>
                <ReactSelect
                  options={opcionesEstablecimiento}
                  value={selectedEst}
                  onChange={(selected) =>
                    handleSucursalChange(
                      index,
                      "id_typeSucursalFacts",
                      selected ? selected.value : null
                    )
                  }
                  isClearable
                  isSearchable
                  isDisabled={!isEditing(index)}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Municipio</label>
                <ReactSelect
                  options={opcionesMunicipios}
                  value={selectedMun}
                  onChange={(selected) =>
                    handleSucursalChange(
                      index,
                      "id_municipio",
                      selected ? selected.value : null
                    )
                  }
                  isClearable
                  isSearchable
                  isDisabled={!isEditing(index)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </form>
  );
};

export default Sucursales;

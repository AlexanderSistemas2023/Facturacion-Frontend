import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { 
    listPermisosModulos,
    createPermisosModulos,
    deletePermisosModulos 
} from "../api/permisosModulos";
import { createPermisos } from "../api/permisos"
import { listModulos } from "../api/modulos";
import Loader from "../components/Loader";

const Permisos = () => {
  const [loading, setLoading] = useState(true);
  const [permisos, setlistPermisosModulos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modulos, setListModulos] = useState([]);
  const [selectedPermiso, setSelectedPermiso] = useState(null);
  const [selectedModulo, setSelectedModulo] = useState(null); 
  const [nuevoPermisoNombre, setNuevoPermisoNombre] = useState({});
  const [nuevaDescription, setNuevaDescription] = useState({});     
  const [agregandoPermiso, setAgregandoPermiso] = useState({});     

  // Estados para permisos
  const [listar, setListar] = useState(true);
  const [agregar, setAgregar] = useState(false);
  const [editar, setEditar] = useState(false);
  const [imprimir, setImprimir] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listPermisosModulos({});
        setlistPermisosModulos(data.data || []);

        const modu = await listModulos({});
        setListModulos(modu.data || []);
      } catch (error) {
        console.error("Error al obtener los permisos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddModuloClick = (permiso) => {
    setSelectedPermiso(permiso);
    setSelectedModulo(null);
    setListar(true);
    setAgregar(false);
    setEditar(false);
    setImprimir(false);
    setShowModal(true);
  };


  const handleDeleteModuloClick = async (id) => {
    deletePermisosModulos(id);
    const data = await listPermisosModulos({});
      setlistPermisosModulos(data.data || []);
  };


  const handleSelectChange = (selectedOption) => {
    setSelectedModulo(selectedOption);
  };


  const handleSaveModulo = async () => {
    if (!selectedModulo) return;
    setSubmitting(true);
    try {
      const payload = {
        id_permiso: selectedPermiso.id,
        id_modulo: selectedModulo.value, // enviar el id
        listar,
        agregar,
        editar,
        imprimir,
        status: 1,
      };
      await createPermisosModulos(payload);

      const data = await listPermisosModulos({});
      setlistPermisosModulos(data.data || []);

      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar el módulo", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Opciones filtradas para el select dentro del modal, según el permiso seleccionado
const opcionesModuloFiltradas = selectedPermiso
  ? modulos
      .filter(
        (m) =>
          !selectedPermiso.PermisosModulos.some(
            (pm) => pm.id_modulo === m.id
          )
      )
      .map((m) => ({
        value: m.id.toString(),
        label: `${m.modulo} | ${m.description}`,
      }))
  : [];


const handleInputChange = (idSucursal, field, value) => {
  if(field === "nombre") {
    setNuevoPermisoNombre((prev) => ({ ...prev, [idSucursal]: value }));
  } else if(field === "description") {
    setNuevaDescription((prev) => ({ ...prev, [idSucursal]: value }));
  }
};

const handleAddPermiso = async (idSucursal) => {
  if (!nuevoPermisoNombre[idSucursal]?.trim()) return;
  setAgregandoPermiso((prev) => ({ ...prev, [idSucursal]: true }));
  try {
    const payload = {
      permiso: nuevoPermisoNombre[idSucursal],
      description: nuevaDescription[idSucursal],
      id_sucursal: idSucursal,
      status: 1,
    };

    await createPermisos(payload);

    const data = await listPermisosModulos({});
    setlistPermisosModulos(data.data || []);

    // Limpiar solo el input de esta sucursal
    setNuevoPermisoNombre((prev) => ({ ...prev, [idSucursal]: "" }));
    setNuevaDescription((prev) => ({ ...prev, [idSucursal]: "" }));
  } catch (error) {
    console.error("Error al crear permiso:", error);
  } finally {
    setAgregandoPermiso((prev) => ({ ...prev, [idSucursal]: false }));
  }
};

  
  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Permisos por Sucursal</h2>

      {permisos.length === 0 ? (
        <p className="text-gray-500">Sin sucursales asignadas</p>
      ) : (
        permisos.map((sucursal) => (
          <div
            key={sucursal.id}
            className="border rounded-lg p-4 mb-4 shadow-sm bg-white"
          >
            <h3 className="text-lg font-semibold">
              {sucursal.nombre}{" "}
              <span className="text-sm text-gray-500">
                ({sucursal.codigo_sucursal})
              </span>
            </h3>

            <div className="mt-2 flex items-center space-x-2">
            
            <input
  type="text"
  className="border rounded px-2 py-1 w-32"
  placeholder="Permiso"
  value={nuevoPermisoNombre[sucursal.id] || ""}
  onChange={(e) => handleInputChange(sucursal.id, "nombre", e.target.value)}
  disabled={agregandoPermiso[sucursal.id] || false}
/>

<input
  type="text"
  className="border rounded px-2 py-1 w-48"
  placeholder="Descripción del permiso"
  value={nuevaDescription[sucursal.id] || ""}
  onChange={(e) => handleInputChange(sucursal.id, "description", e.target.value)}
  disabled={agregandoPermiso[sucursal.id] || false}
/>

<button
  onClick={() => handleAddPermiso(sucursal.id)}
  disabled={agregandoPermiso[sucursal.id] || false}
  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
>
  {agregandoPermiso[sucursal.id] ? "Agregando..." : "Agregar Permiso"}
</button>

                          </div>

            {sucursal.Permisos.length === 0 ? (
              <p className="text-gray-500">Sin permisos asignados</p>
            ) : (
              sucursal.Permisos.map((permiso) => {
                const modulosAsignadosIds = permiso.PermisosModulos.map(
                  (m) => m.Modulo.id
                );
                const modulosDisponibles = modulos.filter(
                  (m) => !modulosAsignadosIds.includes(m.id)
                );

                return (
                  <div key={permiso.id} className="mt-4">
                    <h4 className="font-medium text-blue-700">
                      {permiso.permiso}{" "}
                      <span className="text-gray-600">- {permiso.description}</span>
                    </h4>

                    {permiso.PermisosModulos.length === 0 ? (
                      <p className="text-gray-400 ml-4">Sin módulos asignados</p>
                    ) : (
                      <table className="min-w-full mt-2 border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-2 py-1 text-left">Módulo</th>
                            <th className="border px-2 py-1 text-left">Descripción</th>
                            <th className="border px-2 py-1">Listar</th>
                            <th className="border px-2 py-1">Agregar</th>
                            <th className="border px-2 py-1">Editar</th>
                            <th className="border px-2 py-1">Imprimir</th>
                            <th className="border px-2 py-1">Opciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {permiso.PermisosModulos.map((modulo) => (
                            <tr key={modulo.id}>
                              <td className="border px-2 py-1 font-semibold">
                                {modulo.Modulo.modulo}
                              </td>
                              <td className="border px-2 py-1 text-gray-600">
                                {modulo.Modulo.description}
                              </td>
                              <td
                                className={`border px-2 py-1 ${
                                  modulo.listar ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {modulo.listar ? "Sí" : "No"}
                              </td>
                              <td
                                className={`border px-2 py-1 ${
                                  modulo.agregar ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {modulo.agregar ? "Sí" : "No"}
                              </td>
                              <td
                                className={`border px-2 py-1 ${
                                  modulo.editar ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {modulo.editar ? "Sí" : "No"}
                              </td>
                              <td
                                className={`border px-2 py-1 ${
                                  modulo.imprimir ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {modulo.imprimir ? "Sí" : "No"}
                              </td>
                              <td className="border px-2 py-1 text-center">
                                <button  onClick={() => handleDeleteModuloClick(modulo.id)} className="text-red-500">Eliminar</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    <div className="mt-2">
                      {modulosDisponibles.length > 0 ? (
                        <button
                          onClick={() => handleAddModuloClick(permiso)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Agregar Módulo
                        </button>
                      ) : (
                        <p className="text-sm text-gray-400">
                          No hay módulos disponibles para agregar
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && selectedPermiso && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              Agregar módulo a {selectedPermiso.permiso}
            </h3>

            <div>
              <label className="block mb-1 font-medium">Modulos</label>
              <ReactSelect
                options={opcionesModuloFiltradas} 
                value={selectedModulo}
                onChange={handleSelectChange}
                placeholder="Seleccione un modulo"
                isSearchable
                isClearable
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <label>
                <input
                  type="checkbox"
                  checked={listar}
                  onChange={() => setListar(!listar)}
                  disabled={submitting}
                />{" "}
                Listar
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={agregar}
                  onChange={() => setAgregar(!agregar)}
                  disabled={submitting}
                />{" "}
                Agregar
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={editar}
                  onChange={() => setEditar(!editar)}
                  disabled={submitting}
                />{" "}
                Editar
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={imprimir}
                  onChange={() => setImprimir(!imprimir)}
                  disabled={submitting}
                />{" "}
                Imprimir
              </label>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                disabled={submitting}
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleSaveModulo}
                className={`px-4 py-2 rounded flex items-center justify-center gap-2 ${
                  submitting
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {submitting && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {submitting ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permisos;

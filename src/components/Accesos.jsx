import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import EstadoBadge from "../components/EstadoBadge";
import { 
      listAcceso , 
      changeUsuariosAcceso, 
      createUsuariosAcceso, 
      editUsuariosAcceso,
    } from "../api/usuarioSucursales";
import { listPermisos } from "../api/permisos"
import { listUsuarios } from "../api/usuarios";
import Loader from "./Loader";

const Accesos = () => {
   const [loading, setLoading] = useState(true);
   const [accesos, setAccesos] = useState([]);
   const [submitting, setSubmitting] = useState(false);
   const [showModal, setShowModal] = useState(false);
   const [editMode, setEditMode] = useState(false);
   const [currentId, setCurrentId] = useState(null);
   const [permisos, setPermisos] = useState([]);
   const [usuarios, setUsuarios] = useState([]);

   const fetchData = async () => {
      try {
        const data = await listAcceso ({});
        setAccesos(data.data);

        const per = await listPermisos ({});
        setPermisos(per.data);

        const user = await listUsuarios ({});
        setUsuarios(user.data)

      } catch (error) {
        console.error("Error al obtener las accesos", error);
      } finally {
        setLoading(false);
      }
    };

 useEffect(() => {
    fetchData();
  }, []);

  const [form, setForm] = useState({
    id_usuario: "",
    id_permiso: "",
    status: "",
  });

   // Abrir modal para nuevo acceso
  const openModalForNew = () => {
    setForm({ id_usuario: "",  id_permiso: "", status: "" });
    setEditMode(false);
    setCurrentId(null);
    setShowModal(true);
  };

// Abrir modal para editar acceso
 const openModalForEdit = (acceso) => {
  setForm({
    id_usuario: acceso?.Usuario?.id?.toString() || "",
    id_permiso: acceso?.Permiso?.id?.toString() || "",
    status: acceso.status?.toString() || "",
  });
  setCurrentId(acceso.id);
  setEditMode(true);
  setShowModal(true);
};

// Cambiar estado del acceso del usuario
  const handleToggleStatus = async (acceso) => {
    const newStatus = acceso.status === 1 ? 0 : 1;
    try {
      await changeUsuariosAcceso(acceso.id, { status: newStatus });
      await fetchData();
    } catch (error) {
      console.error("Error al cambiar el estado de la categoría", error);
    }
  };

   // Guardar o actualizar acceso
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const data = {
          id_usuario: form.id_usuario,
          id_permiso: form.id_permiso,
          status: form.status,
        };
  
        if (editMode) {
          await editUsuariosAcceso(currentId, data);
        } else {
          await createUsuariosAcceso(data);
        }
  
        await fetchData();
        setShowModal(false);
      } catch (error) {
        console.error("Error al guardar la categoría", error);
      } finally {
        setSubmitting(false);
      }
    };

    // Manejar cambios de campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSelectChange = (value, name) => {
    setForm((prev) => ({ ...prev, [name]: value ? value.value : "" }));
  };


  const opcionesPermiso = permisos.map((p) => ({
    value: p.id.toString(),
    label: `${p.permiso} | ${p.Sucursale?.codigo_sucursal} | ${p.Sucursale?.nombre}`,
  }));


   const opcionesUsuario = usuarios.map((u) => ({
    value: u.id.toString(),
    label: `${u.codigo} | ${u.username} |${u.nombre + " " +u.apellido} `,
  }));


   if (loading) return <Loader />;

  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Accesos</h2>
        <button
          onClick={openModalForNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Acceso
        </button>
      </div>

      {/* Tabla de categorías */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border">Codigo</th>
              <th className="px-4 py-2 border">UserName</th>
              <th className="px-4 py-2 border">Nombre Completo</th>
              <th className="px-4 py-2 border">Sucursal</th>
              <th className="px-4 py-2 border">Acceso</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Opción</th>
            </tr>
          </thead>
          <tbody>
            {accesos.map((acceso, index) => (
              <tr
                key={acceso.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-200"
                } hover:bg-blue-200`}
              >
                <td className="px-4 py-2 border">{acceso.Usuario?.codigo}</td>
                <td className="px-4 py-2 border">{acceso.Usuario?.username}</td>
                <td className="px-4 py-2 border">{acceso.Usuario?.nombre + " " + acceso.Usuario?.apellido}</td>
                <td className="px-4 py-2 border">{acceso.Permiso?.Sucursale?.codigo_sucursal +" | "+acceso.Permiso?.Sucursale?.nombre}</td>
                <td
                    className="px-4 py-2 border"
                    dangerouslySetInnerHTML={{
                    __html: `<b>${acceso.Permiso?.permiso || "Sin permiso"}</b><br>${acceso.Permiso?.description || ""}`,
                      }} >
                </td>
                <td className="px-4 py-2 border">
                  <EstadoBadge status={acceso.status} />
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openModalForEdit(acceso)}
                      className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
                    >
                      Editar
                    </button>

                    {acceso.status === 1 ? (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(acceso)}
                        className="bg-red-100 text-red-800 px-4 py-1 rounded hover:bg-red-200 text-sm"
                      >
                        Deshabilitar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(acceso)}
                        className="bg-green-100 text-green-800 px-4 py-1 rounded hover:bg-green-200 text-sm"
                      >
                        Activar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {editMode ? "Editar Acceso" : "Agregar Nueva Acceso"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                
                  <div>
                  <label className="block mb-1 font-medium">Usuario</label>
                  <ReactSelect
                    options={opcionesUsuario}
                    value={opcionesUsuario.find((opt) => opt.value === form.id_usuario) || null}
                    onChange={(val) => handleSelectChange(val, "id_usuario")}
                    placeholder="Seleccione un usuario"
                    isSearchable
                    isClearable
                  />
                </div>

                 <div>
                  <label className="block mb-1 font-medium">Permiso</label>
                  <ReactSelect
                    options={opcionesPermiso}
                    value={opcionesPermiso.find((opt) => opt.value === form.id_permiso) || null}
                    onChange={(val) => handleSelectChange(val, "id_permiso")}
                    placeholder="Seleccione el acceso"
                    isSearchable
                    isClearable
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Estado</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 font-medium ${
                      form.status === "1"
                        ? "bg-green-100 text-green-800"
                        : form.status === "0"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }`}
                    required
                  >
                    <option value="">Selecciona...</option>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
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
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded flex items-center justify-center gap-2 ${
                    submitting
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {submitting && (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {submitting
                    ? editMode
                      ? "Actualizando..."
                      : "Guardando..."
                    : editMode
                    ? "Actualizar"
                    : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accesos;
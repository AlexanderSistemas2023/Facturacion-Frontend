import { useEffect, useState, useCallback } from "react";
import EstadoBadge from "../components/EstadoBadge";
import Loader from "../components/Loader";
import {
  listUsuarios,
  updateUsuarios,
  createUsuarios,
  changeUsuarios,
} from "../api/usuarios";

import {
   listUsuariosAcceso
} from "../api/usuarioSucursales"

const Usuarios = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [usuarios, setusuarios] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [accesosPorUsuario, setAccesosPorUsuario] = useState({});

  const [form, setForm] = useState({
           codigo : "",       
           username : "",
           nombre : "",
           apellido : "",
           correo : "",
           telefono : "",
           password : "",
           status :  "",
           dui : "",
           nit : "",
  });


  
  // Obtener categorías
  const fetchusuarios = useCallback(async () => {
  try {
    const data = await listUsuarios({});
    setusuarios(data.data);
    for (const usuario of data.data) {
      usuarioSucursales(usuario);
    }
  } catch (error) {
    console.error("Error al obtener las categorías", error);
  } finally {
    setLoading(false);
  }
}, []);

    useEffect(() => {
  fetchusuarios();
}, [fetchusuarios]);


  // Manejar cambios de campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Abrir modal para nueva categoría
  const openModalForNew = () => {
    setForm({ name: "", description: "", status: "" });
    setEditMode(false);
    setCurrentId(null);
    setShowModal(true);
  };

  // Abrir modal para editar categoría
  const openModalForEdit = (usuario) => {
    setForm({
        codigo : usuario.codigo || "",
        username : usuario.username || "",
        nombre : usuario.nombre || "",
        apellido : usuario.apellido || "",
        dui : usuario.dui || "",
        nit : usuario.nit || "",
        correo : usuario.correo || "",
        telefono : usuario.telefono || "",
        password : usuario.password || "",
        status :  String(usuario.status ?? ""),
       
    });
    setCurrentId(usuario.id);
    setEditMode(true);
    setShowModal(true);
  };

  // Guardar o actualizar categoría
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
           codigo : form.codigo,
           username : form.username,
           nombre : form.nombre,
           apellido : form.apellido,
           dui : form.dui,
           nit : form.nit,
           correo : form.correo,
           telefono : form.telefono,
           password : form.password,
           status :  form.status,
      };

      if (editMode) {
        await updateUsuarios(currentId, data);
      } else {
        await createUsuarios(data);
      }

      await fetchusuarios();
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar la categoría", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Cambiar estado de una categoría
  const handleToggleStatus = async (usuario) => {
    const newStatus = usuario.status === 1 ? 0 : 1;
    try {
      await changeUsuarios(usuario.id, { status: newStatus });
      await fetchusuarios();
    } catch (error) {
      console.error("Error al cambiar el estado de la categoría", error);
    }
  };


  const usuarioSucursales = async (usuario) => {
  try {
    const res = await listUsuariosAcceso(usuario.id);
    console.log("Respuesta de accesos:", res);
    setAccesosPorUsuario((prev) => ({
      ...prev,
      [usuario.id]: res.data || [],
    }));
  } catch (error) {
    console.error("Error al listar acceso del usuario", error);
  }
};


  if (loading) return <Loader />;

  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <button
          onClick={openModalForNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Usuario
        </button>
      </div>

      {/* Tabla de categorías */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border">Codigo</th>
              <th className="px-4 py-2 border">UserName</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Apellido</th>
              <th className="px-4 py-2 border">Dui</th>
              <th className="px-4 py-2 border">Nit</th>
              <th className="px-4 py-2 border">Correo</th>
              <th className="px-4 py-2 border">Telefono</th>
              <th className="px-4 py-2 border">Accesos</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Opción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr
                key={usuario.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-200"
                } hover:bg-blue-200`}
              >
                <td className="px-4 py-2 border">{usuario.codigo}</td>
                 <td className="px-4 py-2 border">{usuario.username}</td>
                <td className="px-4 py-2 border">{usuario.nombre}</td>
                 <td className="px-4 py-2 border">{usuario.apellido}</td>
                <td className="px-4 py-2 border">{usuario.dui}</td>
                 <td className="px-4 py-2 border">{usuario.nit}</td>
                <td className="px-4 py-2 border">{usuario.correo}</td>
                <td className="px-4 py-2 border">{usuario.telefono}</td>
                <td className="px-4 py-2 border text-xs">
                {accesosPorUsuario[usuario.id] ? (
                   accesosPorUsuario[usuario.id].length > 0 ? (
                    <div className="space-y-1">
                      {accesosPorUsuario[usuario.id].map((acceso, idx) => (
                       <div
                              key={idx}
                              className={`px-2 py-1 rounded shadow-sm animate-fade-in ${
                              acceso.estado === "Inactivo"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                              }`}
                        >
                         <strong>{acceso.sucursal}</strong> - {acceso.permisos} ({acceso.estado})
                       </div>
                       ))}
                    </div>
                     ) : ( <span className="text-gray-400 italic">Sin sucursales asignadas</span> )
                     ) : ( <span className="text-gray-400 italic">Cargando...</span> )}
                </td>
                <td className="px-4 py-2 border">
                  <EstadoBadge status={usuario.status} />
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openModalForEdit(usuario)}
                      className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
                    >
                      Editar
                    </button>

                    {usuario.status === 1 ? (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(usuario)}
                        className="bg-red-100 text-red-800 px-4 py-1 rounded hover:bg-red-200 text-sm"
                      >
                        Deshabilitar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(usuario)}
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
              {editMode ? "Editar Usuario" : "Agregar Nuevo Usuario"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Codigo</label>
                  <input
                    type="text"
                    name="codigo"
                    value={form.codigo}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>


                <div>
                  <label className="block mb-1 font-medium">UserName</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>


                <div>
                  <label className="block mb-1 font-medium">apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>



                <div>
                  <label className="block mb-1 font-medium">Dui</label>
                  <input
                    type="text"
                    name="dui"
                    value={form.dui}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>


                <div>
                  <label className="block mb-1 font-medium">Nit</label>
                  <input
                    type="text"
                    name="nit"
                    value={form.nit}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>


                 <div>
                  <label className="block mb-1 font-medium">Correo</label>
                  <input
                    type="text"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>


                <div>
                  <label className="block mb-1 font-medium">Telefono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
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

export default Usuarios;

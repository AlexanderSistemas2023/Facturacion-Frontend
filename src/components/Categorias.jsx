import { useEffect, useState } from "react";
import EstadoBadge from "../components/EstadoBadge";
import Loader from "../components/Loader";
import {
  listCategorias,
  updateCategorias,
  createCategorias,
  changeCategorias,
} from "../api/categorias";

const Categorias = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "",
  });

  // Obtener categorías
  const fetchCategorias = async () => {
    try {
      const data = await listCategorias({});
      setCategorias(data.data);
    } catch (error) {
      console.error("Error al obtener las categorías", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

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
  const openModalForEdit = (categoria) => {
    setForm({
      name: categoria.name || "",
      description: categoria.description || "",
      status: String(categoria.status ?? ""),
    });
    setCurrentId(categoria.id);
    setEditMode(true);
    setShowModal(true);
  };

  // Guardar o actualizar categoría
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        name: form.name,
        description: form.description,
        status: form.status,
      };

      if (editMode) {
        await updateCategorias(currentId, data);
      } else {
        await createCategorias(data);
      }

      await fetchCategorias();
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar la categoría", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Cambiar estado de una categoría
  const handleToggleStatus = async (categoria) => {
    const newStatus = categoria.status === 1 ? 0 : 1;
    try {
      await changeCategorias(categoria.id, { status: newStatus });
      await fetchCategorias();
    } catch (error) {
      console.error("Error al cambiar el estado de la categoría", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
        <button
          onClick={openModalForNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Categoría
        </button>
      </div>

      {/* Tabla de categorías */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Descripción</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Opción</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria, index) => (
              <tr
                key={categoria.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-200"
                } hover:bg-blue-200`}
              >
                <td className="px-4 py-2 border">{categoria.name}</td>
                <td className="px-4 py-2 border">{categoria.description}</td>
                <td className="px-4 py-2 border">
                  <EstadoBadge status={categoria.status} />
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openModalForEdit(categoria)}
                      className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
                    >
                      Editar
                    </button>

                    {categoria.status === 1 ? (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(categoria)}
                        className="bg-red-100 text-red-800 px-4 py-1 rounded hover:bg-red-200 text-sm"
                      >
                        Deshabilitar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(categoria)}
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
              {editMode ? "Editar Categoría" : "Agregar Nueva Categoría"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Categoría</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Descripción</label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
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

export default Categorias;

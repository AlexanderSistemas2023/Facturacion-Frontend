import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import EstadoBadge from "../components/EstadoBadge";
import Loader from "../components/Loader";
import {
  listClientLazy,
  updateClienteReceptor,
  createClienteReceptor,
  changeClienteReceptor,
} from "../api/clientesReceptor";

import {
  listDepartamento012,
  listMunicipio013,
  listActividadEconomica19,
} from "../api/hacienda";

const Clientes = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [actividad, setActividadEconomica] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clienteReceptor, setClienteReceptor] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [buscar, setBuscar] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    nombreComercial: "",
    nit: "",
    dui: "",
    nrc: "",
    actividad: "",
    departamento: "",
    municipio: "",
    direccionComplemento: "",
    telefono: "",
    correo: "",
    status: "",
  });

  const fetchData = async (p = 1) => {
    try {
      const data = await listClientLazy(p, limit, buscar);
      setClienteReceptor(data.data);

      const dep = await listDepartamento012({});
      setDepartamentos(dep.data);

      const mun = await listMunicipio013({});
      setMunicipios(mun.data);

      const act = await listActividadEconomica19({});
      setActividadEconomica(act.data);

      setTotalPages(data.totalPages);
      setPage(data.currentPage);

    } catch (error) {
      console.error("Error al obtener las categorías", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
     // eslint-disable-next-line 
  }, [page, limit, buscar]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModalForNew = () => {
    setForm({
      nombre: "",
      nombreComercial: "",
      nit: "",
      dui: "",
      nrc: "",
      actividad: "",
      departamento: "",
      municipio: "",
      direccionComplemento: "",
      telefono: "",
      correo: "",
      status: "",
    });
    setEditMode(false);
    setCurrentId(null);
    setShowModal(true);
  };

  const openModalForEdit = (c) => {
    setForm({
      nombre: c.nombre || "",
      nombreComercial: c.nombreComercial || "",
      nit: c.nit || "",
      dui: c.dui || "",
      nrc: c.nrc || "",
      actividad: c.id_actividad_economica?.toString() || "",
      departamento: c.id_departamento?.toString() || "",
      municipio: c.id_municipio?.toString() || "",
      direccionComplemento: c.direccionComplemento || "",
      telefono: c.telefono || "",
      correo: c.correo || "",
      status: String(c.status ?? ""),
    });
    setCurrentId(c.id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        nombre: form.nombre,
        nombreComercial: form.nombreComercial,
        nit: form.nit,
        dui: form.dui,
        nrc: form.nrc,
        id_actividad_economica: form.actividad,
        id_departamento: form.departamento,
        id_municipio: form.municipio,
        direccionComplemento: form.direccionComplemento,
        telefono: form.telefono,
        correo: form.correo,
        status: form.status,
      };

      if (editMode) {
        await updateClienteReceptor(currentId, data);
      } else {
        await createClienteReceptor(data);
      }

      await fetchData();
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar el cliente", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (c) => {
    const newStatus = c.status === 1 ? 0 : 1;
    try {
      await changeClienteReceptor(c.id, { status: newStatus });
      await fetchData();
    } catch (error) {
      console.error("Error al cambiar el estado del cliente", error);
    }
  };

  const handleSelectChange = (value, name) => {
    setForm((prev) => ({ ...prev, [name]: value ? value.value : "" }));
  };

  const opcionesDepartamento = departamentos.map((d) => ({
    value: d.id.toString(),
    label: `${d.codigo} | ${d.name}`,
  }));

  const opcionesMunicipio = municipios.map((d) => ({
    value: d.id.toString(),
    label: `${d.codigo} | ${d.name}`,
  }));

  const opcionesActividad = actividad.map((d) => ({
    value: d.id.toString(),
    label: `${d.codigo} | ${d.name}`,
  }));

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Clientes</h2>
        <button
          onClick={openModalForNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Cliente
        </button>
      </div>


      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar cliente..."
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


      {/* Tabla de clientes */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Nombre Comercial</th>
              <th className="px-4 py-2 border">N° Registro</th>
              <th className="px-4 py-2 border">Dui</th>
              <th className="px-4 py-2 border">Nit</th>
              <th className="px-4 py-2 border">Telefono</th>
              <th className="px-4 py-2 border">Actividad Economica</th>
              <th className="px-4 py-2 border">Departamento</th>
              <th className="px-4 py-2 border">Municipio</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Opción</th>
            </tr>
          </thead>
          <tbody>
            {clienteReceptor.map((cclienteReceptor, index) => (
              <tr
                key={cclienteReceptor.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-200"
                } hover:bg-blue-200`}
              >
                <td className="px-4 py-2 border">{cclienteReceptor.nombre}</td>
                <td className="px-4 py-2 border">{cclienteReceptor.nombreComercial}</td>
                <td className="px-4 py-2 border">{cclienteReceptor.nrc}</td>
                <td className="px-4 py-2 border">{cclienteReceptor.dui}</td>
                <td className="px-4 py-2 border">{cclienteReceptor.nit}</td>
                <td className="px-4 py-2 border">{cclienteReceptor.telefono}</td>
                <td className="px-4 py-2 border">{cclienteReceptor.CodigoActividadEconomica?.name}</td>
                <td className="px-4 py-2 border">{cclienteReceptor.Departamento?.name}</td>
                <td className="px-4 py-2 border">{cclienteReceptor.Municipio?.name}</td>
                <td className="px-4 py-2 border">
                  <EstadoBadge status={cclienteReceptor.status} />
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openModalForEdit(cclienteReceptor)}
                      className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
                    >
                      Editar
                    </button>

                    {cclienteReceptor.status === 1 ? (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(cclienteReceptor)}
                        className="bg-red-100 text-red-800 px-4 py-1 rounded hover:bg-red-200 text-sm"
                      >
                        Deshabilitar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(cclienteReceptor)}
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


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-4 my-8">
            <h3 className="text-xl font-bold mb-4">
              {editMode ? "Editar Cliente" : "Agregar Nuevo Cliente"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Representante</label>
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
                  <label className="block mb-1 font-medium">Nombre Comercial</label>
                  <input
                    type="text"
                    name="nombreComercial"
                    value={form.nombreComercial}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">NRC (N° Registro)</label>
                  <input
                    type="text"
                    name="nrc"
                    value={form.nrc}
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
                  <label className="block mb-1 font-medium">correo</label>
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
                  <label className="block mb-1 font-medium">Departamento</label>
                  <ReactSelect
                    options={opcionesDepartamento}
                    value={opcionesDepartamento.find((opt) => opt.value === form.departamento) || null}
                    onChange={(val) => handleSelectChange(val, "departamento")}
                    placeholder="Seleccione un departamento"
                    isSearchable
                    isClearable
                  />
                </div>


                 <div>
                  <label className="block mb-1 font-medium">Municipio</label>
                  <ReactSelect
                    options={opcionesMunicipio}
                    value={opcionesMunicipio.find((opt) => opt.value === form.municipio) || null}
                    onChange={(val) => handleSelectChange(val, "municipio")}
                    placeholder="Seleccione un municipio"
                    isSearchable
                    isClearable
                  />
                </div>


                <div>
                  <label className="block mb-1 font-medium">Actividad Económica</label>
                  <ReactSelect
                    options={opcionesActividad}
                    value={opcionesActividad.find((opt) => opt.value === form.actividad) || null}
                    onChange={(val) => handleSelectChange(val, "actividad")}
                    placeholder="Seleccione una actividad"
                    isSearchable
                    isClearable
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">Dirección</label>
                  <textarea
                    name="direccionComplemento"
                    value={form.direccionComplemento}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 min-h-[80px]"
                    required
                  ></textarea>
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

export default Clientes;

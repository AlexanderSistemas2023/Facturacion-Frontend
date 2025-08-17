import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { createProductos, updateProducto, listProductosLazy } from "../api/productos";
import { listCategorias } from "../api/categorias";
import { 
          listUnidadMedida014, 
          listTipoItem011,
          listTributo015 
        } from "../api/hacienda";
import Loader from "../components/Loader";

const Productos = () => {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [tipoItem, setTipoItem] = useState([]);
  const [tributo, setTributo] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [buscar, setBuscar] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    sku: "",
    number_part: "",
    stock: "",
    imagen: null,
    categoria: "",
    unidadMedida: "",
    tributo: "",
    tipoItem: "",
  });


   const fetchData = async (p = 1) => {
      try {
        const data = await listProductosLazy(p, limit, buscar);
        setProductos(data.data);
        setTotalPages(data.totalPages);
        setPage(data.currentPage);

      } catch (error) {
        console.error("Error al obtener productos", error);
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchData(page);
     // eslint-disable-next-line 
  }, [page, limit, buscar]);
  
  useEffect(() => {
    if (showModal) {

      listTipoItem011()
        .then((res) => setTipoItem(res.data || []))
        .catch((error) => console.error("Error al obtener tipo item", error))

      listUnidadMedida014()
        .then((res) => setUnidadesMedida(res.data || []))
        .catch((error) => console.error("Error al obtener unidades", error))

      listTributo015()
        .then((res) => setTributo(res.data || []))
        .catch((error) => console.error("Error al obtener tributos", error))

      listCategorias()
        .then((res) => setCategorias(res.data || []))
        .catch((error) => console.error("Error al obtener categorías", error))
    }
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSelectChange = (value, name) => {
    setForm((prev) => ({ ...prev, [name]: value ? value.value : "" }));
  };

  const openModalForEdit = (producto) => {
    setForm({
      nombre: producto.name || "",
      descripcion: producto.description || "",
      number_part: producto.number_part || "",
      sku:  producto.sku || "",
      precio: producto.price || "",
      stock: producto.ExistenciaProducto?.stock || "",
      imagen: null,
      categoria: producto.id_category?.toString() || "",
      unidadMedida: producto.id_unidad_medida?.toString() || "",
      tipoItem: producto.id_type_item?.toString() || "",
      tributo: producto.id_tributo?.toString() || "",
    });
    setCurrentId(producto.id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      const data = {
        name: form.nombre,
        description: form.descripcion,
        sku: form.sku,
        number_part: form.number_part,
        price: parseFloat(form.precio),
        stock: parseInt(form.stock),
        id_category: form.categoria,
        id_unidad_medida: form.unidadMedida,
        id_type_item: form.tipoItem,
        id_tributo: form.tributo,
        status: 1,
      };

      if (editMode) {
        await updateProducto(currentId, data);
      } else {
        await createProductos(data);
      }

      setShowModal(false);
     const updated = await fetchData(page);
     setProductos(updated.data);
     
    } catch (error) {
      console.error("Error al guardar el producto", error);
    } finally {
      setSubmitting(false);
    }
  };

  const opcionesUnidades = unidadesMedida.map((u) => ({
    value: u.id.toString(),
    label: `${u.codigo} | ${u.name}`,
  }));

  const opcionesItems = tipoItem.map((i) => ({
    value: i.id.toString(),
    label: `${i.codigo} | ${i.name}`,
  }));

  const opcionesCategorias = categorias.map((c) => ({
    value: c.id.toString(),
    label: `${c.id} | ${c.name}`,
  }));

  const opcionesTributo = tributo.map((t) => ({
    value: t.id.toString(),
    label: `${t.codigo} | ${t.name}`,
  }));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <button
          onClick={() => {
            setEditMode(false);
            setForm({
              nombre: "",
              descripcion: "",
              precio: "",
              stock: "",
              imagen: null,
              categoria: "",
              unidadMedida: "",
              tipoItem: "",
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar producto
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
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


      <div className="overflow-x-auto relative">

         {/* Tabla de categorías con animación de carga */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10">
            <Loader />
          </div>
        )}
        <table className="min-w-full border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border">Sku</th>
              <th className="px-4 py-2 border">N° Partes</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Descripción</th>
              <th className="px-4 py-2 border">Precio</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Categoría</th>
              <th className="px-4 py-2 border">Unidad Medida</th>
              <th className="px-4 py-2 border">Tributo</th>
              <th className="px-4 py-2 border">Tipo Item</th>
              <th className="px-4 py-2 border">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="px-4 py-2 border">{p.sku}</td>
                <td className="px-4 py-2 border">{p.number_part}</td>
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{p.description}</td>
                <td className="px-4 py-2 border">${p.price}</td>
                <td className="px-4 py-2 border">{p.ExistenciaProducto?.stock}</td>
                <td className="px-4 py-2 border">{p.Categoria?.name}</td>
                <td className="px-4 py-2 border">{p.UnidadMedida?.name}</td>
                <td className="px-4 py-2 border">{p.Tributo?.name}</td>
                <td className="px-4 py-2 border">{p.TipoItem?.name}</td>
                <td className="px-4 py-2 border">
                  <button
                    type="button"
                    onClick={() => openModalForEdit(p)}
                    className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
                  >
                    Editar
                  </button>
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


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {editMode ? "Editar producto" : "Agregar nuevo producto"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Nombre</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Descripción</label>
                  <input
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                   <label className="block mb-1 font-medium"> Stock
                     <span className="text-xs text-red-500 ml-2">(debes dar ingreso)</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    readOnly
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Sku</label>
                  <input
                    type="text"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>


                 <div>
                  <label className="block mb-1 font-medium">N° partes</label>
                  <input
                    type="text"
                    name="number_part"
                    value={form.number_part}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Categoría</label>
                  <ReactSelect
                    options={opcionesCategorias}
                    value={opcionesCategorias.find((opt) => opt.value === form.categoria) || null}
                    onChange={(val) => handleSelectChange(val, "categoria")}
                    placeholder="Seleccione una categoría"
                    isSearchable
                    isClearable
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Tributo</label>
                  <ReactSelect
                    options={opcionesTributo}
                    value={opcionesTributo.find((opt) => opt.value === form.tributo) || null}
                    onChange={(val) => handleSelectChange(val, "tributo")}
                    placeholder="Seleccione un Tributo"
                    isSearchable
                    isClearable
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Unidad de medida</label>
                  <ReactSelect
                    options={opcionesUnidades}
                    value={opcionesUnidades.find((opt) => opt.value === form.unidadMedida) || null}
                    onChange={(val) => handleSelectChange(val, "unidadMedida")}
                    placeholder="Seleccione una unidad de medida"
                    isSearchable
                    isClearable
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Tipo de item</label>
                  <ReactSelect
                    options={opcionesItems}
                    value={opcionesItems.find((opt) => opt.value === form.tipoItem) || null}
                    onChange={(val) => handleSelectChange(val, "tipoItem")}
                    placeholder="Seleccione tipo de item"
                    isSearchable
                    isClearable
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
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

export default Productos;

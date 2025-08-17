import { useEffect, useState } from "react";
import ReactSelect from "react-select";

// componentes
import EstadoBadge from "../components/EstadoBadge";
import Loader from "../components/Loader";

// conexiones a la API
import {  AddIngresos } from "../api/ingresos";
import { listFacturacionesLazy } from "../api/ventas";
import { listTipoDocumento002 } from "../api/hacienda"
import { listProductosLazy } from "../api/productos";
import { listClienteReceptor } from "../api/clientesReceptor"

// utilidades
import { DataIngreso } from '../utils/validaciones';
import { formatDateReadable } from '../utils/fechas'
import { selloRecepcion } from '../utils/selloRecepcion'

const Ventas = () => {
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [buscar, setBuscar] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Modal principal
  const [showModal, setShowModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [proveedorSeleccionado, setClientesSeleccionado] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [fechaFacturacion, setFechaFacturacion] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [codigoFactura, setCodigoFactura] = useState("");
  const [tipoFactura, setTipoFactura] = useState("");
  

  // Modal de productos
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [buscarProducto, setBuscarProducto] = useState("");
  const [pagePro, setPagePro] = useState(1);
  const [totalPagesPro, setTotalPagesPro] = useState(1);
  const [limitPro] = useState(10);

  const [tipoDocumento, setTipoDocumento] = useState([]);

  const [form, setForm] = useState({
  });


  const fetchData = async (p = 1) => {
    try {
      setEditMode(false);
      setLoading(true);
      const data = await listFacturacionesLazy(p, limit, buscar);
      setVentas(data.data);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);

      const doc = await listTipoDocumento002();
      setTipoDocumento(doc.data);

    } catch (error) {
      console.error("Error al obtener los ingresos", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const data = await listClienteReceptor();
      setClientes(data.data.map(p => ({ value: p.id, label: p.nrc +" | "+ p.nombre +" | "+ p.nombreComercial})));
    } catch (error) {
      console.error("Error al obtener clientes receptores", error);
    }
  };

  const fetchProductos = async (p = 1) => {
    try {
      const data = await listProductosLazy(p, limitPro, buscarProducto);
      setProductos(data.data);
      setTotalPagesPro(data.totalPages);
      setPagePro(data.currentPage);
    } catch (error) {
      console.error("Error al obtener productos", error);
    }
  };

  useEffect(() => {
    fetchData(page);
     // eslint-disable-next-line 
  }, [page, limit, buscar]);

  useEffect(() => {
    if (showProductoModal) {
      fetchProductos(pagePro);
    }
    // eslint-disable-next-line 
  }, [showProductoModal, pagePro, buscarProducto]);

  const handleAddProducto = (producto) => {
    const newProd = {
      value: producto.id,
      label: `${producto.sku} | ${producto.name}`,
      cantidad: 1,
      precio: producto.price,
    };
    const exists = productosSeleccionados.find(p => p.value === newProd.value);
    if (!exists) {
      setProductosSeleccionados([...productosSeleccionados, newProd]);
    }
  };

  const handleChangeCantidad = (index, cantidad) => {
    const updated = [...productosSeleccionados];
    updated[index].cantidad = cantidad;
    setProductosSeleccionados(updated);
  };

  const handleChangePrecio = (index, precio) => {
    const updated = [...productosSeleccionados];
    updated[index].precio = precio;
    setProductosSeleccionados(updated);
  };

   const handleSelectChange = (value, name) => {
    setTipoFactura(value.value);
    setForm((prev) => ({ ...prev, [name]: value ? value.value : "" }));
  };

   const opcionesTipoDocumento = tipoDocumento.map((c) => ({
    value: c.id.toString(),
    label: `${c.codigo} | ${c.name}`,
  }));

  const handleProcesarIngreso = async () => {
    setSubmitting(true);
    try {
     const ingresoData = {
     codigo_factura: codigoFactura,
     numero_factura: numeroFactura,
     id_proveedor: proveedorSeleccionado ? proveedorSeleccionado.value : null,
     fecha_ingreso: fechaFacturacion,
     id_sucursal: 3,   // ajusta según tu lógica
     id_typeFacts: tipoFactura,
     ingresoDetalle: productosSeleccionados.map((p) => ({
       id_producto: p.value,
       cantidad: Number(p.cantidad) || 0,
    })),
  };

  // validando los datos de envio para proceder al ingreso
  if (DataIngreso(ingresoData)){
    await AddIngresos(ingresoData);
    setShowModal(false);
    setProductosSeleccionados([]);
    await fetchData(1);
  }
    } catch (error) {
      
    } finally {
      setSubmitting(false);
    }  
};


  return (
    <div className="p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Ventas</h2>
        <button
          onClick={() => {
            fetchClientes();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Venta
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar venta..."
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
          {[10, 15, 25, 50, 100].map(num => (
            <option key={num} value={num}>
              {num} por página
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de ingresos */}
      <div className="overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10">
            <Loader />
          </div>
        )}
        <table className="min-w-full border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Cliente</th>
              <th className="px-4 py-2 border">Nombre Comercial</th>
              <th className="px-4 py-2 border">Tipo de factura</th>
              <th className="px-4 py-2 border">Total Venta</th>
              <th className="px-4 py-2 border">Sucursal</th>
                <th className="px-4 py-2 border">Codigo Generacion</th>
              <th className="px-4 py-2 border">Numero de Control</th>
              <th className="px-4 py-2 border">Sello de Recepción</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Opción</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, index) => (
              <tr
                key={venta.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
              >
                <td className="px-4 py-2 border">{formatDateReadable(venta.createdAt)}</td>
                <td className="px-4 py-2 border">{venta.ClientesReceptor?.nombre}</td>
                <td className="px-4 py-2 border">{venta.ClientesReceptor?.nombreComercial}</td>
                <td className="px-4 py-2 border">
                  {venta.TipoDocumento?.codigo} | {venta.TipoDocumento?.name}
                </td>
                <td className="px-4 py-2 border">{venta.total}</td>
                <td className="px-4 py-2 border">
                  {venta.Sucursale?.codigo_sucursal} |{" "}
                  {venta.Sucursale?.nombre}
                </td>
                 <td className="px-4 py-2 border">{venta.codGeneration}</td>
                <td className="px-4 py-2 border">{venta.dteSerial}</td>
                <td className="px-4 py-2 border">{selloRecepcion(venta.mhResponse)}</td>
                <td className="px-4 py-2 border">
                  <EstadoBadge status={venta.status} />
                </td>
                <td className="px-4 py-2 border">
                  <button className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación ingresos */}
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
              page === num ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"
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

      {/* Modal Principal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50">
          <div className="bg-white rounded w-[900px] max-h-[90vh] overflow-auto flex">
            {/* Sección izquierda: Detalles ingreso */}
            <div className="w-1/2 p-6 border-r">
              <h3 className="text-lg font-bold mb-4">Nueva Venta</h3>
              <label className="block mb-2 font-semibold">Cliente</label>
                <ReactSelect 
                  options={clientes} 
                  onChange={setClientesSeleccionado}
                  placeholder="Seleccione el cliente" 
                />

               <label className="block mb-1 font-medium">Tipo de factura</label>
                <ReactSelect
                  options={opcionesTipoDocumento}
                  value={opcionesTipoDocumento.find((opt) => opt.value === form.tipoDocumento) || null}
                  onChange={(val) => handleSelectChange(val, "tipoDocumento")}
                  placeholder="Seleccione el tipo de documento"
                  isSearchable
                  isClearable
                />
              <label className="block mt-4 mb-2 font-semibold">Fecha Ingreso</label>
              <input
                type="date"
                value={fechaFacturacion}
                onChange={(e) => setFechaFacturacion(e.target.value)}
                className="border rounded px-3 py-1 w-full"
              />
              <label className="block mt-4 mb-2 font-semibold">Código Factura</label>
              <input
                type="text"
                value={codigoFactura}
                onChange={(e) => setCodigoFactura(e.target.value)}
                className="border rounded px-3 py-1 w-full"
              />
              <label className="block mt-4 mb-2 font-semibold">Número Factura</label>
              <input
                type="text"
                value={numeroFactura}
                onChange={(e) => setNumeroFactura(e.target.value)}
                className="border rounded px-3 py-1 w-full"
              />
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>


                <button
                  disabled={submitting}
                  onClick={handleProcesarIngreso}
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
                      : "Procesando Datos..."
                    : editMode
                    ? "Actualizar"
                    : "Agregar Venta"}
                </button>


              </div>
            </div>

            {/* Sección derecha: Productos */}
            <div className="w-1/2 p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Productos Seleccionados</h4>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => setShowProductoModal(true)}
                >
                  + Agregar
                </button>
              </div>
              {productosSeleccionados.length > 0 ? (
                <table className="min-w-full border mt-2">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-2 py-1">Producto</th>
                      <th className="border px-2 py-1">Cantidad</th>
                      <th className="border px-2 py-1">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosSeleccionados.map((prod, i) => (
                      <tr key={prod.value}>
                        <td className="border px-2 py-1">{prod.label}</td>
                        <td className="border px-2 py-1">
                          <input
                            type="number"
                            value={prod.cantidad}
                            onChange={(e) => handleChangeCantidad(i, e.target.value)}
                            className="w-20 border rounded px-1"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="number"
                            value={prod.precio}
                            onChange={(e) => handleChangePrecio(i, e.target.value)}
                            className="w-24 border rounded px-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 mt-2">No hay productos seleccionados.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Productos */}
      {showProductoModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50">
          <div className="bg-white rounded w-[700px] max-h-[80vh] overflow-auto p-6">
            <h3 className="text-lg font-bold mb-4">Seleccionar Productos</h3>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={buscarProducto}
              onChange={(e) => {
                setBuscarProducto(e.target.value);
                setPagePro(1);
              }}
              className="border rounded px-3 py-1 w-full mb-4"
            />
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">SKU</th>
                  <th className="border px-2 py-1">Nombre</th>
                  <th className="border px-2 py-1">Precio</th>
                  <th className="border px-2 py-1">Existencia</th>
                  <th className="border px-2 py-1">Agregar</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.id}>
                    <td className="border px-2 py-1">{prod.sku}</td>
                    <td className="border px-2 py-1">{prod.name}</td>
                    <td className="border px-2 py-1">{prod.price}</td>
                      <td className="border px-2 py-1">{prod?.ExistenciaProducto?.stock}</td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        onClick={() => handleAddProducto(prod)}
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación productos */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                disabled={pagePro === 1}
                onClick={() => setPagePro(pagePro - 1)}
                className={`px-3 py-1 border rounded ${
                  pagePro === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Anterior
              </button>
              {Array.from({ length: totalPagesPro }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPagePro(num)}
                  className={`px-3 py-1 border rounded ${
                    pagePro === num
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                disabled={pagePro === totalPagesPro}
                onClick={() => setPagePro(pagePro + 1)}
                className={`px-3 py-1 border rounded ${
                  pagePro === totalPagesPro
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Siguiente
              </button>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowProductoModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;

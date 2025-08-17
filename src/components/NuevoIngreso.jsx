import { useState } from "react";
import ReactSelect from "react-select";

function NuevoIngreso({ showModal, setShowModal, proveedores, productos }) {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [codigoFactura, setCodigoFactura] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const [showProductoModal, setShowProductoModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const handleAgregarProducto = (producto) => {
    if (!productosSeleccionados.find((p) => p.value === producto.value)) {
      setProductosSeleccionados([
        ...productosSeleccionados,
        { ...producto, cantidad: 1, precio: 0 },
      ]);
    }
    setShowProductoModal(false);
  };

  const handleChangeCantidad = (index, value) => {
    const nuevos = [...productosSeleccionados];
    nuevos[index].cantidad = value;
    setProductosSeleccionados(nuevos);
  };

  const handleChangePrecio = (index, value) => {
    const nuevos = [...productosSeleccionados];
    nuevos[index].precio = value;
    setProductosSeleccionados(nuevos);
  };

  const handleProcesarIngreso = () => {
    console.log({
      proveedor: proveedorSeleccionado,
      fechaIngreso,
      codigoFactura,
      numeroFactura,
      productos: productosSeleccionados,
    });
    setShowModal(false);
  };

  return (
    <>
      {/* MODAL PRINCIPAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-[900px] max-h-[90vh] overflow-auto p-6">
            <h3 className="text-lg font-bold mb-4">Nuevo Ingreso</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* COLUMNA IZQUIERDA - Datos */}
              <div>
                <label className="block mb-2 font-semibold">Proveedor</label>
                <ReactSelect
                  options={proveedores}
                  onChange={setProveedorSeleccionado}
                  value={proveedorSeleccionado}
                />

                <label className="block mt-4 mb-2 font-semibold">
                  Fecha Ingreso
                </label>
                <input
                  type="date"
                  value={fechaIngreso}
                  onChange={(e) => setFechaIngreso(e.target.value)}
                  className="border rounded px-3 py-1 w-full"
                />

                <label className="block mt-4 mb-2 font-semibold">
                  Código Factura
                </label>
                <input
                  type="text"
                  value={codigoFactura}
                  onChange={(e) => setCodigoFactura(e.target.value)}
                  className="border rounded px-3 py-1 w-full"
                />

                <label className="block mt-4 mb-2 font-semibold">
                  Número Factura
                </label>
                <input
                  type="text"
                  value={numeroFactura}
                  onChange={(e) => setNumeroFactura(e.target.value)}
                  className="border rounded px-3 py-1 w-full"
                />
              </div>

              {/* COLUMNA DERECHA - Productos */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Productos Seleccionados</h4>
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => setShowProductoModal(true)}
                  >
                    + Agregar
                  </button>
                </div>
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-2 py-1">Producto</th>
                      <th className="border px-2 py-1">Cant.</th>
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
                            onChange={(e) =>
                              handleChangeCantidad(i, e.target.value)
                            }
                            className="w-16 border rounded px-1"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="number"
                            value={prod.precio}
                            onChange={(e) =>
                              handleChangePrecio(i, e.target.value)
                            }
                            className="w-20 border rounded px-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleProcesarIngreso}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Procesar Ingreso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PRODUCTOS */}
      {showProductoModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-[700px] max-h-[80vh] overflow-auto p-6">
            <h3 className="text-lg font-bold mb-4">Seleccionar Producto</h3>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border rounded px-3 py-1 w-full mb-4"
            />
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">Producto</th>
                  <th className="border px-2 py-1">Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos
                  .filter((p) =>
                    p.label.toLowerCase().includes(busqueda.toLowerCase())
                  )
                  .map((prod) => (
                    <tr key={prod.value}>
                      <td className="border px-2 py-1">{prod.label}</td>
                      <td className="border px-2 py-1 text-center">
                        <button
                          className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          onClick={() => handleAgregarProducto(prod)}
                        >
                          Agregar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowProductoModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NuevoIngreso;

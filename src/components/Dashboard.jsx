import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FiBox,
  FiSettings,
  FiShoppingCart,
  FiLogOut,
  FiMenu,
  FiCopy,
  FiArchive,
  FiBookOpen,
  FiTruck,
  FiFolderPlus,
  FiMapPin,
  FiUserCheck,
  FiHome,
  FiUsers,
  FiUserX,
  FiUserPlus,
  FiShieldOff,
  FiShare2,
} from "react-icons/fi";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventarioOpen, setInventarioOpen] = useState(false);
  const [ingresoOpen, setIngresoOpen] = useState(false);
  const [usuarioOpen, setUsuarioOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  

  const cerrarSesion = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const isRootDashboard = location.pathname === "/dashboard";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">FACTURACIÓN</h2>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            to=""
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-2 rounded hover:bg-blue-100 text-gray-700 font-bold"
          >
            <FiHome /> Dashboard
          </Link>

          {/* Submenú: Inventario */}
          <div className="space-y-1">
            <button
              onClick={() => setInventarioOpen(!inventarioOpen)}
              className="w-full flex items-center justify-between p-2 rounded hover:bg-blue-100 text-gray-700"
            >
              <span className="flex items-center gap-3">
                <FiBox /> Inventario
              </span>
              <span>{inventarioOpen ? "▲" : "▼"}</span>
            </button>
            {inventarioOpen && (
              <div className="ml-6 space-y-1">
                <Link
                  to="productos"
                  onClick={() => {
                    setSidebarOpen(false);
                    setUsuarioOpen(false);
                    setIngresoOpen(false);
                  }}
                  className="block p-2 rounded hover:bg-blue-50 text-sm text-gray-700"
                >
                  <span className="flex items-center gap-3">
                    <FiArchive />
                    Productos
                  </span>
                </Link>
                <Link
                  to="categorias"
                  onClick={() => {
                    setSidebarOpen(false);
                    setUsuarioOpen(false);
                    setIngresoOpen(false);
                  }}
                  className="block p-2 rounded hover:bg-blue-50 text-sm text-gray-700"
                >
                  <span className="flex items-center gap-3">
                    <FiCopy />
                    Categorías
                  </span>
                </Link>
              </div>
            )}
          </div>


          {/* Submenú: Ingresos */}
          <div className="space-y-1">
            <button
              onClick={() => setIngresoOpen(!ingresoOpen)}
              className="w-full flex items-center justify-between p-2 rounded hover:bg-blue-100 text-gray-700"
            >
              <span className="flex items-center gap-3">
                <FiFolderPlus /> Ingresos
              </span>
              <span>{ingresoOpen ? "▲" : "▼"}</span>
            </button>
            {ingresoOpen && (
              <div className="ml-6 space-y-1">
                <Link
                  to="ingresos"
                  onClick={() => {
                    setSidebarOpen(false);
                    setInventarioOpen(false);
                    setUsuarioOpen(false);
                  }}
                  className="block p-2 rounded hover:bg-blue-50 text-sm text-gray-700"
                >
                  <span className="flex items-center gap-3">
                    <FiBookOpen />
                    Ingresos
                  </span>
                </Link>
                <Link
                  to="proveedores"
                  onClick={() => {
                    setSidebarOpen(false);
                    setInventarioOpen(false);
                    setUsuarioOpen(false);
                  }}
                  className="block p-2 rounded hover:bg-blue-50 text-sm text-gray-700"
                >
                  <span className="flex items-center gap-3">
                    <FiTruck />
                    Proveedores
                  </span>
                </Link>
              </div>
            )}
          </div>


          {/* Submenú: Usuarios */}
          <div className="space-y-1">
            <button
              onClick={() => setUsuarioOpen(!usuarioOpen)}
              className="w-full flex items-center justify-between p-2 rounded hover:bg-blue-100 text-gray-700"
            >
              <span className="flex items-center gap-3">
                <FiUsers /> Usuarios
              </span>
              <span>{usuarioOpen ? "▲" : "▼"}</span>
            </button>
            {usuarioOpen && (
              <div className="ml-6 space-y-1">
                <Link
                  to="usuarios"
                  onClick={() => {
                    setSidebarOpen(false);
                    setInventarioOpen(false);
                    setIngresoOpen(false);
                  }}
                  className="block p-2 rounded hover:bg-blue-50 text-sm text-gray-700"
                >
                  <span className="flex items-center gap-3">
                    <FiUserPlus />
                    Usuarios
                  </span>
                </Link>
                <Link
                  to="accesos"
                  onClick={() => {
                    setSidebarOpen(false);
                    setInventarioOpen(false);
                    setIngresoOpen(false);
                  }}
                  className="block p-2 rounded hover:bg-blue-50 text-sm text-gray-700"
                >
                  <span className="flex items-center gap-3">
                    <FiUserX />
                    Accesos
                  </span>
                </Link>

                 <Link
                  to="permisos"
                  onClick={() => {
                    setSidebarOpen(false);
                    setInventarioOpen(false);
                    setIngresoOpen(false);
                  }}
                  className="block p-2 rounded hover:bg-blue-50 text-sm text-gray-700"
                >
                  <span className="flex items-center gap-3">
                    <FiShieldOff />
                    Permisos
                  </span>
                </Link>

              </div>
            )}
          </div>

          {/* Otras rutas */}
          <Link
            to="ventas"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-2 rounded hover:bg-blue-100 text-gray-700"
          >
            <FiShoppingCart /> Ventas
          </Link>

          <Link
            to="clientes"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-2 rounded hover:bg-blue-100 text-gray-700"
          >
            <FiUserCheck /> Clientes
          </Link>

          <Link
            to="sucursales"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-2 rounded hover:bg-blue-100 text-gray-700"
          >
            <FiMapPin /> Sucursales
          </Link>

          <Link
            to="configuracion"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-2 rounded hover:bg-blue-100 text-gray-700"
          >
            <FiSettings /> Configuración
          </Link>


          <Link
            to="modulos"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-2 rounded hover:bg-blue-100 text-gray-700"
          >
            <FiShare2 /> Modulos
          </Link>

          <button
            onClick={cerrarSesion}
            className="flex items-center gap-3 p-2 rounded hover:bg-red-100 text-red-600 w-full text-left"
          >
            <FiLogOut /> Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar (mobile only) */}
        <header className="flex items-center justify-between bg-white px-4 py-2 shadow lg:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu size={24} />
          </button>
          <h1 className="text-lg font-semibold">Panel de control</h1>
        </header>

        {/* Main content */}
        <main className="flex-1 p-2 sm:p-4 overflow-auto bg-gray-50">
          {isRootDashboard ? (
            <>
              <div className="bg-white shadow rounded-2xl p-4 sm:p-6 text-center">
                <h2 className="text-2xl font-semibold mb-2 text-blue-600">
                  Bienvenido al Panel de Facturación
                </h2>
                <p className="text-gray-600">
                  Usa el menú lateral para navegar por las diferentes secciones del sistema.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
                {[
                  { title: "Compras", desc: "Gestione sus órdenes de compra, proveedores y recepción de productos." },
                  { title: "Inventario", desc: "Controle el stock en tiempo real, entradas y salidas con precisión." },
                  { title: "Facturación", desc: "Emita facturas electrónicas, gestión de clientes y reportes detallados." },
                  { title: "Reportes", desc: "Visualice estadísticas y rendimiento del negocio con gráficos interactivos." },
                  { title: "Usuarios", desc: "Administre usuarios, roles y permisos de acceso al sistema." },
                  { title: "Configuración", desc: "Personalice parámetros fiscales, datos de la empresa y más." },
                ].map((modulo, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-xl transform transition duration-300 hover:scale-105"
                  >
                    <h4 className="text-lg font-semibold mb-2 text-green-700">
                      {modulo.title}
                    </h4>
                    <p className="text-sm text-gray-600">{modulo.desc}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full overflow-x-auto">
              {/*
                Envolver el contenido de las rutas hijas en un div con overflow-x-auto
                para que las tablas y otros elementos grandes sean responsivos.
                Además, se agregan clases para mejorar la visualización de tablas.
              */}
              <div className="min-w-full">
                <Outlet />
              </div>
              {/* Estilos globales para tablas */}
              <style>{`
                table {
                  width: 100%;
                  border-collapse: collapse;
                  background: white;
                  border-radius: 1rem;
                  overflow: hidden;
                  font-size: 0.95rem;
                }
                th, td {
                  padding: 0.75rem 1rem;
                  border-bottom: 1px solid #e5e7eb;
                  text-align: left;
                }
                th {
                  background: #f1f5f9;
                  color: #2563eb;
                  font-weight: 600;
                }
                tr:last-child td {
                  border-bottom: none;
                }
                @media (max-width: 640px) {
                  table, thead, tbody, th, td, tr {
                    display: block;
                  }
                  thead tr {
                    display: none;
                  }
                  td {
                    position: relative;
                    padding-left: 50%;
                    min-height: 2.5rem;
                  }
                  td:before {
                    position: absolute;
                    top: 0;
                    left: 1rem;
                    width: 45%;
                    white-space: nowrap;
                    font-weight: 600;
                    color: #2563eb;
                    content: attr(data-label);
                  }
                }
              `}</style>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

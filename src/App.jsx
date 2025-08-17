// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Accesos from "./components/Accesos"
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Productos from "./components/Productos";
import Ventas from "./components/Ventas";
import Categorias from "./components/Categorias";
import Sucursales from "./components/Sucursales";
import Ingresos from "./components/Ingresos";
import Proveedores from "./components/Proveedores";
import Clientes from "./components/Clientes";
import Usuarios from "./components/Usuarios";
import Permisos from "./components/Permisos";
import Modulos from "./components/Modulos";
import Configuracion from "./components/Configuracion";
import PrivateRoute from "./components/PrivateRoute";
import Loader from "./components/Loader";
import Registro from "./components/Registro";
import NotFound from "./components/NotFound";

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <Loader />}
      <Routes>
        <Route path="/" element={<Login setIsLoading={setIsLoading} />} />

         <Route path="registro" element={<Registro />} /> 
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={ <PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="productos" element={ <PrivateRoute><Productos /></PrivateRoute>} />
          <Route path="ventas" element={<PrivateRoute><Ventas /></PrivateRoute>} />
          <Route path="configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
          <Route path="categorias" element={<PrivateRoute><Categorias /></PrivateRoute>} />
          <Route path="sucursales" element={<PrivateRoute><Sucursales /></PrivateRoute>} />
          <Route path="ingresos" element={<PrivateRoute><Ingresos /></PrivateRoute>} /> 
          <Route path="proveedores" element={<PrivateRoute><Proveedores /></PrivateRoute>} /> 
          <Route path="clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} /> 
          <Route path="usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} /> 
          <Route path="accesos" element={<PrivateRoute><Accesos /></PrivateRoute>} /> 
          <Route path="permisos" element={<PrivateRoute><Permisos /></PrivateRoute>} /> 
          <Route path="modulos" element={<PrivateRoute><Modulos /></PrivateRoute>} /> 

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

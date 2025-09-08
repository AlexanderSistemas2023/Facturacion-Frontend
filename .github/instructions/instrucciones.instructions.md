# Especificación Única para IA — Facturación Frontend

Este documento único provee todo lo necesario para que una IA implemente y extienda la app. Incluye estructura del proyecto, reglas de trabajo, configuración, contratos de APIs y patrones de uso.

## 1) Entorno y ejecución

- Runtime: React (Create React App), React Router, TailwindCSS, Chakra UI, Axios.
- Node 18+ (recomendado 20+), npm 9+.
- Variables de entorno (archivo `.env`):
  - REACT_APP_BACKEND_URL: URL base del backend (sin slash final). Ej: https://api.midominio.com
- Scripts:
  - `npm run dev` / `npm start`: inicia http://localhost:3000
  - `npm run build`: genera `build/`
  - `npm test`: ejecuta pruebas

## 2) Estructura del proyecto (carpetas clave)

- `src/api/`: módulos de servicio por recurso. Usan `axiosInstance` y devuelven `response.data`.
- `src/components/`: componentes y vistas; sin lógica de red; consumen servicios de `api/`.
- `src/context/`: contextos de React (p. ej., `LoadingContext`).
- `src/routes/`: definición de rutas; `PrivateRoute.jsx` protege rutas con token.
- `src/utils/`: utilidades transversales (alertas, fechas, validaciones, etc.).
- `src/App.jsx`: árbol de rutas principal.
- `src/index.js`: arranque de React.

Reglas:

- Componentes en PascalCase, servicios y utilidades en camelCase.
- Errores se muestran con `utils/alertHelper` (`showAlertError`, `showAlertExito`, `showAlertInfo`).
- No llamar Axios directamente en componentes, usar `src/api/*.js`.

## 3) Config HTTP global

Archivo: `src/api/axiosInstance.js`

- baseURL: `process.env.REACT_APP_BACKEND_URL`
- Header de autenticación: `client-token` tomado de `sessionStorage.getItem('token')` si existe.
- Todas las funciones de `api/*.js` deben usar esta instancia.

## 4) Autenticación y rutas protegidas

- Login: `src/api/auth.js` → `loginUser(data)` POST `/clients/login`.
  - Si la respuesta incluye `token`, guardarlo en `sessionStorage` bajo la clave `token`.
- `components/PrivateRoute.jsx` condiciona acceso según existencia de token.

## 5) Contratos de APIs por recurso

Nota: Todas retornan `response.data`. En errores, usan `showAlertError` y no lanzan excepción salvo que se especifique.

### 5.1 Auth (`src/api/auth.js`)

- POST `/clients/login` → `loginUser(data)`
  - Entrada: credenciales, p. ej., `{ usuario, clave }` (definir según backend).
  - Salida: `{ token?: string, ... }`

### 5.2 Productos (`src/api/productos.js`)

- GET `/productos/list/:empresaId` → `listProductos(params)`
- GET `/productos/lazy/:empresaId/:page/:limit/:buscar` → `listProductosLazy(page, limit, buscar)`
- POST `/productos/create` → `createProductos(data)`
- PUT `/productos/edit/:id` → `updateProducto(id, data)`

### 5.3 Usuarios (`src/api/usuarios.js`)

- GET `/usuarios/list` → `listUsuarios()`
- GET `/usuarios/lazy/:page/:limit/:buscar` → `listUsuariosLazy(page, limit, buscar)`
- POST `/usuarios/create` → `createUsuarios(data)`
- POST `/usuarios/createform` → `createUsuariosForm(data)`
- PUT `/usuarios/edit/:id` → `updateUsuarios(id, data)`
- PATCH `/usuarios/change/:id` → `changeUsuarios(id, data)`

### 5.4 Ventas/Facturación (`src/api/ventas.js`)

- GET `/facturar/lazy/:page/:limit/:buscar` → `listFacturacionesLazy(page, limit, buscar)`
- POST `/facturar/ccf` → `FacturacionCCF(data)`
- POST `/facturar/fe` → `FacturacionFe(data)`
- POST `/facturar/anulacion` → `Anulacion(data)`
- POST `/facturar/firmador` → `Firmador(data)` / `Token(data)`
- POST `/facturar/presentacion_hacienda` → `presentacionHacienda(data, dteSerial)`

### 5.5 Ingresos (`src/api/ingresos.js`)

- GET `/ingresos/list` → `listIngresos()`
- GET `/ingresos/lazy/:page/:limit/:buscar` → `listIngresosLazy(page, limit, buscar)`
- POST `/ingresos/add` → `AddIngresos(data)` (si `estado===0`, mostrar `showAlertInfo` con `msg`)

### 5.6 Sucursales (`src/api/sucursales.js`)

- GET `/sucursales/list` → `listSucursales(params)`
- POST `/sucursales/create` → `createSucursales(data)`
- POST `/sucursales/createform` → `createFormSucursales(data)`
- PUT `/sucursales/edit/:id` → `updateSucursales(id, data)`

### 5.7 Permisos (`src/api/permisos.js`)

- GET `/permisos/list` → `listPermisos()`
- POST `/permisos/create` → `createPermisos(data)`
- POST `/permisos/createpermisoform` → `createPermisosForm(data)`

### 5.8 Módulos (`src/api/modulos.js`)

- GET `/modulos/list` → `listModulos()`
- GET `/modulos//lazy/:page/:limit/:buscar` → `listModulosLazy(page, limit, buscar)`
  - Nota: Doble `/` presente en el código actual.

### 5.9 Permisos por módulos (`src/api/permisosModulos.js`)

- GET `/permisomodulos/list` → `listPermisosModulos()`
- POST `/permisomodulos/create` → `createPermisosModulos(data)`
- DELETE `/permisomodulos/delete/:id` → `deletePermisosModulos(id)`

### 5.10 Usuarios por sucursal (`src/api/usuarioSucursales.js`)

- GET `/usuariosucursales/list` → `listAcceso()`
- GET `/usuariosucursales/list/:id_usuario` → `listUsuariosAcceso(id_usuario)`
- PUT `/usuariosucursales/edit/:id` → `editUsuariosAcceso(id, data)`
- POST `/usuariosucursales/create` → `createUsuariosAcceso(data)`
- PATCH `/usuariosucursales/change/:id` → `changeUsuariosAcceso(id, data)`

### 5.11 Clientes receptores (`src/api/clientesReceptor.js`)

- GET `/receptor/list` → `listClienteReceptor()`
- GET `/receptor/lazy/:page/:limit/:buscar` → `listClientLazy(page, limit, buscar)`
- POST `/receptor/create` → `createClienteReceptor(data)`
- PUT `/receptor/edit/:id` → `updateClienteReceptor(id, data)`
- PATCH `/receptor/change/:id` → `changeClienteReceptor(id, data)`

### 5.12 Clientes (negocio) (`src/api/clientes.js`)

- POST `/clients/data` → `listClientData()`
- POST `/clients/update` → `updateCliente(data)`
- POST `/clients/registro` → `createCliente(data)`

### 5.13 Categorías (`src/api/categorias.js`)

- GET `/categorias/list` → `listCategorias(params)`
- GET `/categorias/lazy/:page/:limit/:buscar` → `listCategoriasLazy(page, limit, buscar)`
- POST `/categorias/create` → `createCategorias(data)`
- PUT `/categorias/edit/:id` → `updateCategorias(id, data)`
- PATCH `/categorias/change/:id` → `changeCategorias(id, data)`

### 5.14 Proveedores (`src/api/proveedores.js`)

- GET `/provider/list` → `listProveedor()`
- GET `/provider/lazy/:page/:limit/:buscar` → `listProveedorLazy(page, limit, buscar)`
- POST `/provider/create` → `createProveedor(data)`
- PUT `/provider/edit/:id` → `updateProveedor(id, data)`
- PATCH `/provider/change/:id` → `changeProveedor(id, data)`

### 5.15 Catálogos Hacienda (`src/api/hacienda.js`)

- GET `/dtecatalogo/dte_ambientes` → `listAmbiente001()`
- GET `/dtecatalogo/dte_tipo_documento` → `listTipoDocumento002()`
- GET `/dtecatalogo/dte_tipo_establecimiento` → `listTipoEstablecimiento009()`
- GET `/dtecatalogo/dte_tipo_item` → `listTipoItem011()`
- GET `/dtecatalogo/dte_departamento` → `listDepartamento012()`
- GET `/dtecatalogo/dte_municipio` → `listMunicipio013()`
- GET `/dtecatalogo/dte_unidad_medida` → `listUnidadMedida014()`
- GET `/dtecatalogo/dte_tributo` → `listTributo015()`
- GET `/dtecatalogo/dte_codigo_actividad_economica` → `listActividadEconomica19()`

## 6) Patrones de implementación

- UI consume servicios API y muestra feedback con `alertHelper`.
- Paginación lazy usa rutas `/recurso/lazy/:page/:limit/:buscar`.
- Actualizaciones suelen usar `PUT /edit/:id`; cambios de estado usan `PATCH /change/:id`.
- Tokens de sesión en `sessionStorage` bajo `token`.

## 7) Contrato de componentes/rutas

- `App.jsx` define rutas; `/` es `Login`, rutas anidadas bajo `/dashboard` están protegidas.
- Componentes de páginas principales: `Dashboard`, `Productos`, `Ventas`, `Categorias`, `Sucursales`, `Ingresos`, `Proveedores`, `Clientes`, `Usuarios`, `Permisos`, `Modulos`, `Configuracion`, `Accesos`.

## 8) Reglas para nuevas features

- Crear archivo en `src/api/<recurso>.js` siguiendo el patrón mostrado.
- No repetir `baseURL`; usar `axiosInstance`.
- Añadir feedback de éxito/fracaso.
- Añadir ruta y componente si es una nueva vista, bajo `/dashboard/<recurso>` cuando aplique.
- Mantener consistencia de nombres y convenciones.

## 9) Edge cases a considerar

- Token ausente/expirado: `axiosInstance` no añade header; componentes deben manejar redirección a login si el backend responde 401.
- Parámetros `buscar` vacíos en endpoints `lazy`: usar `"-"` o string vacío según backend.
- IDs inválidos en `edit/change`: mostrar `showAlertInfo` si backend retorna `estado===0` y `msg`.

## 10) Ejemplo de uso en componente

```jsx
import { useEffect, useState } from "react";
import { listProductosLazy } from "./api/productos";

export default function ProductosPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await listProductosLazy(1, 10, "");
      setItems(data?.items || data || []);
    })();
  }, []);
  return <div>{items.length} productos</div>;
}
```

import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { createCliente } from "../api/clientes";
import { createUsuariosForm } from "../api/usuarios";
import { createFormSucursales } from "../api/sucursales";
import { createPermisosForm } from "../api/permisos";
import { listDepartamento012 , listMunicipio013, listTipoEstablecimiento009 } from "../api/hacienda";


const Registro = () => {

  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [establecimiento, setEstablecimientos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
     const dep = await listDepartamento012({});
        setDepartamentos(dep.data);

        const mun = await listMunicipio013({});
        setMunicipios(mun.data);

         const est = await listTipoEstablecimiento009({});
        setEstablecimientos(est.data);

    };
      fetchData();
  }, []);

  // Estados separados
  const [usuario, setUsuario] = useState({
    id_cliente: "",
    username: "", 
    codigo: "",
    nombre: "", 
    dui: "",
    nit: "",
    apellido: "", 
    correo: "",
    telefono: "",
    password: "",
  });

  const [negocio, setNegocio] = useState({
    name: "",
    nit: "",
    phone: "",
    company: "",
    email: "",
  });

  const [sucursal, setSucursal] = useState({
    id_cliente: "",
    nombre: "",
    codigo_sucursal: "",
    id_typeSucursalFacts: "",
    id_departamento: "",
    id_municipio: "",
    telefono: "",
    correo: "",
    direccion: "",
  });


  const [step, setStep] = useState(1); // 1: usuario, 2: negocio, 3: sucursal
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usuarioJson, setUsuarioJson] = useState(null);
  const [negocioJson, setNegocioJson] = useState(null);
  const [sucursalJson, setSucursalJson] = useState(null);

  const handleSucursalChange = (e) => {
    setSucursal({
      ...sucursal,
      [e.target.name]: e.target.value,
    });
  };


  // Handlers separados
  const handleUsuarioChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleNegocioChange = (e) => {
    setNegocio({
      ...negocio,
      [e.target.name]: e.target.value,
    });
  };

  // Validación y avance de pasos
  const handleUsuarioNext = (e) => {
    e.preventDefault();
    setError("");
    // Validar campos usuario
    if (!usuario.nombre || !usuario.apellido || !usuario.username || !usuario.correo || !usuario.password || !usuario.confirmPassword) {
      return setError("Todos los campos de usuario son obligatorios.");
    }
    if (usuario.password !== usuario.confirmPassword) {
      return setError("Las contraseñas no coinciden.");
    }
    setUsuarioJson(JSON.stringify(usuario, null, 2));
    setStep(2);
  };

  const handleNegocioNext = (e) => {
    e.preventDefault();
    setError("");
    // Validar campos negocio
    if (!negocio.name || !negocio.nit || !negocio.phone || !negocio.company || !negocio.email) {
      return setError("Todos los campos del negocio son obligatorios.");
    }
    setNegocioJson(JSON.stringify(negocio, null, 2));
    setStep(3);
  };

  // Opciones de departamentos
const opcionesDepartamentos = departamentos.map((d) => ({
  value: d.id,
  label: `${d.codigo} | ${d.name}`,
}));

// Opciones de municipios filtrados según departamento
const opcionesMunicipios = municipios
  .filter((m) => Number(m.id_departamentoFact) === Number(sucursal.id_departamento))
  .map((m) => ({
    value: m.id,
    label: `${m.codigo} | ${m.name}`,
  }));

// Handler cuando se selecciona un departamento
const handleDepartamentoChange = (selectedOption) => {
  setSucursal({
    ...sucursal,
    id_departamento: selectedOption ? selectedOption.value : "",
    id_municipio: "", // limpiar municipio al cambiar de departamento
  });
};

// Handler cuando se selecciona un municipio
const handleMunicipioSelect = (selectedOption) => {
  setSucursal({
    ...sucursal,
    id_municipio: selectedOption ? selectedOption.value : "",
  });
};


// Valor seleccionado de municipio
const selectedMun = opcionesMunicipios.find(
  (opt) => opt.value === Number(sucursal.id_municipio)
);


const opcionesEstablecimiento = establecimiento.map((es) => ({
    value: es.id,
    label: `${es.codigo} | ${es.name}`,
  }));


  const handleSucursalNext = async (e) => {
    e.preventDefault();
    setError("");
    // Validar campos sucursal
    if (!sucursal.codigo_sucursal || !sucursal.id_typeSucursalFacts || !sucursal.id_departamento || !sucursal.id_municipio || !sucursal.telefono || !sucursal.correo || !sucursal.direccion || !sucursal.nombre) {
      return setError("Todos los campos de la sucursal son obligatorios.");
    }

    try {
      const clienteResponse = await createCliente(negocio);
      // Asigna el id del cliente al usuario antes de crearlo
      usuario.id_cliente = clienteResponse.data.id;

      const usuarioResponse = await createUsuariosForm(usuario);

      sucursal.id_cliente = clienteResponse.data.id;

      const sucursalResponse = await createFormSucursales(sucursal);

      await createPermisosForm({ id_usuario: usuarioResponse.data.id, id_sucursal: sucursalResponse.data.id});

      setSuccess("Registro completado exitosamente.");
     
    } catch (err) {
      setError("Ocurrió un error al registrar los datos. Intenta nuevamente.");
    }

    // Aquí puedes enviar los tres JSON al backend si lo deseas
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-blue-100 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2 tracking-tight">Registro nuevo negocio</h2>
        <p className="text-center text-gray-500 mb-6">Completa los datos para registrar tu cuenta y tu negocio</p>
        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2 text-center">{success}</p>}

        <form className="space-y-8">
          {/* Paso 1: Usuario */}
          {step === 1 && (
            <div className="bg-blue-50 rounded-2xl p-6 shadow-inner border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">Datos del usuario</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Código Usuario/Empleado</label>
                  <input
                    type="text"
                    name="codigo"
                    value={usuario.codigo}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={usuario.nombre}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={usuario.apellido}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
                    autoComplete="family-name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Usuario/Login </label>
                  <input
                    type="text"
                    name="username"
                    value={usuario.username}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Correo electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    value={usuario.correo}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">DUI</label>
                  <input
                    type="text"
                    name="dui"
                    value={usuario.dui}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">NIT</label>
                  <input
                    type="text"
                    name="nit"
                    value={usuario.nit}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={usuario.telefono}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={usuario.password}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Confirmar contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={usuario.confirmPassword || ""}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <button
                onClick={handleUsuarioNext}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all duration-200 mt-6"
              >
                Siguiente
              </button>
              {usuarioJson && (
                <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">{usuarioJson}</pre>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="bg-green-50 rounded-2xl p-6 shadow-inner border border-green-100">
              <h3 className="text-lg font-semibold text-green-700 mb-4">Datos básicos del negocio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Nombre del Apoderado</label>
                  <input type="text" name="name" value={negocio.name} onChange={handleNegocioChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Nombre del negocio</label>
                  <input type="text" name="company" value={negocio.company} onChange={handleNegocioChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">NIT</label>
                  <input type="text" name="nit" value={negocio.nit} onChange={handleNegocioChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Teléfono del negocio</label>
                  <input type="text" name="phone" value={negocio.phone} onChange={handleNegocioChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Correo del negocio</label>
                  <input type="text" name="email" value={negocio.email} onChange={handleNegocioChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-500 bg-gray-50" />
                </div>
              </div>
              <button onClick={handleNegocioNext} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition-all duration-200 mt-6">Siguiente</button>
              {negocioJson && (
                <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">{negocioJson}</pre>
              )}
            </div>
          )}

          {/* Paso 3: Sucursal */}
          {step === 3 && (
            <div className="bg-yellow-50 rounded-2xl p-6 shadow-inner border border-yellow-100">
              <h3 className="text-lg font-semibold text-yellow-700 mb-4">Datos de la sucursal principal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Código de sucursal</label>
                  <input type="text" name="codigo_sucursal" placeholder="Ej: 1P5J2C52" value={sucursal.codigo_sucursal} onChange={handleSucursalChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 bg-gray-50" />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium">Sucursal</label>
                  <input type="text" name="nombre" placeholder="Ej: Sucursal San Alvador" value={sucursal.nombre} onChange={handleSucursalChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 bg-gray-50" />
                </div>

                <div>
                <label className="block mb-1 font-medium">Establecimiento</label>
                <ReactSelect
                  options={opcionesEstablecimiento}
                  value={
                   opcionesEstablecimiento.find(
                     (opt) => opt.value === Number(sucursal.id_typeSucursalFacts)
                   ) || null
                   }
                  onChange={(selectedOption) =>
                    setSucursal({
                      ...sucursal,
                      id_typeSucursalFacts: selectedOption ? selectedOption.value : "",
                    })
                  }
                  isClearable
                  isSearchable
                />
              </div>

               <div>
              <label className="block mb-1 font-medium">Departamento</label>
                <ReactSelect
                   options={opcionesDepartamentos}
                   value={
                   opcionesDepartamentos.find(
                     (opt) => opt.value === Number(sucursal.id_departamento)
                   ) || null
                   }
                  onChange={handleDepartamentoChange}
                  isClearable
                  isSearchable
                  />
                 </div>
               <div>

              <label className="block mb-1 font-medium">Municipio</label>
                <ReactSelect
                 options={opcionesMunicipios}
                 value={selectedMun || null}
                 onChange={handleMunicipioSelect}
                 isClearable
                 isSearchable
                 placeholder={
                 opcionesMunicipios.length
                   ? "Selecciona un municipio"
                   : "Sin municipios disponibles"
                    }
                />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium">Teléfono sucursal</label>
                  <input type="text" name="telefono" value={sucursal.telefono} onChange={handleSucursalChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Correo sucursal</label>
                  <input type="email" name="correo" value={sucursal.correo} onChange={handleSucursalChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 bg-gray-50" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium">Dirección sucursal</label>
                  <input type="text" name="direccion" value={sucursal.direccion} onChange={handleSucursalChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 bg-gray-50" />
                </div>
              </div>
              <button onClick={handleSucursalNext} className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-yellow-600 transition-all duration-200 mt-6">Finalizar registro</button>
              {sucursalJson && (
                <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">{sucursalJson}</pre>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Registro;

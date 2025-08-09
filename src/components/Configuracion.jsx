import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import {
  listActividadEconomica19,
 /*
  listDepartamento012,
  listMunicipio013,
  listTipoEstablecimiento009,
*/
  listAmbiente001
} from "../api/hacienda";
import { listClientData } from "../api/clientes";
// import { listSucursales } from "../api/sucursales";
import Loader from "../components/Loader";

const Configuracion = () => {
  const [loading, setLoading] = useState(true);
  const [actividad, setActividadEconomica] = useState([]);
//  const [departamentos, setDepartamentos] = useState([]);
//  const [municipios, setMunicipios] = useState([]);
//  const [establecimiento, setEstablecimientos] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [ambiente, setAmbiente] = useState(null);
  const [form, setForm] = useState({});
//  const [sucursalesEdit, setSucursales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const act = await listActividadEconomica19({});
        setActividadEconomica(act.data);

        /*
        const dep = await listDepartamento012({});
        setDepartamentos(dep.data);

        const mun = await listMunicipio013({});
        setMunicipios(mun.data);

        const suc = await listSucursales({});
        setSucursales(suc.data);

        const est = await listTipoEstablecimiento009({});
        setEstablecimientos(est.data);
        */

        const amb = await listAmbiente001({});
        setAmbiente(amb.data);

        const clienteData = await listClientData();
        setCliente(clienteData.data);

        setForm(clienteData.data);
      } catch (error) {
        console.error("Error al obtener datos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleActividadChange = (selected) => {
    setForm((prev) => ({
      ...prev,
      id_actividadEconomicaFacts: selected ? selected.value : "",
    }));
  };


   const handleAmbienteChange = (selected) => {
    setForm((prev) => ({
      ...prev,
      ambiente: selected ? selected.value : "",
    }));
  };


/*
  const handleSucursalChange = (index, field, value) => {
    const updated = [...sucursalesEdit];
    updated[index][field] = value;
    setSucursales(updated);
  };
*/

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario actualizado:", form);
  };

  if (loading || !cliente) return <Loader />;

 
  const opcionesActividades = actividad.map((a) => ({
    value: a.id,
    label: `${a.codigo} | ${a.name}`,
  }));


  const opcionesAmbiente = ambiente.map((am) => ({
    value: am.id,
    label: `${am.codigo} | ${am.name}`,
  }));

/*

 const opcionesDepartamentos = departamentos.map((d) => ({
    value: d.id,
    label: `${d.codigo} | ${d.name}`,
  }));

  const opcionesMunicipios = municipios.map((m) => ({
    value: m.id,
    label: `${m.codigo} | ${m.name}`,
  }));

  const opcionesEstablecimiento = establecimiento.map((es) => ({
    value: es.id,
    label: `${es.codigo} | ${es.name}`,
  }));
  */


  const selectedActividad = opcionesActividades.find(
    (a) => a.value === form.id_actividadEconomicaFacts
  );

   const selectedAmbiente = opcionesAmbiente.find(
    (am) => am.value === form.ambiente
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <h2 className="text-2xl font-bold">Configuración</h2>
      {/* Sección 1: Configuración del Negocio */}
      <section className="bg-gray-200 p-6 rounded-md w-full">
        <h2 className="text-xl font-semibold mb-4">Datos del Negocio</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Nombre", name: "name" },
            { label: "Nombre Comercial", name: "nombreComercial" },
            { label: "Dirección", name: "direccion" },
            { label: "Teléfono", name: "phone" },
            { label: "Correo Electrónico", name: "email" },
            { label: "Sitio Web", name: "website" },
            { label: "NIT", name: "nit" },
            { label: "NRC", name: "nrc" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              <input
                type="text"
                name={name}
                value={form[name] || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}

          <div>
            <label className="block mb-1 font-medium">Actividad Económica</label>
            <ReactSelect
              options={opcionesActividades}
              value={selectedActividad}
              onChange={handleActividadChange}
              isClearable
              isSearchable
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Logo del Negocio</label>
            <input type="file" className="w-full" />
          </div>
        </div>
      </section>

 {/* Sección 2: Configuración de Correo */}
      <section className="bg-white p-6 rounded-md w-full">
        <h2 className="text-xl font-semibold mb-4">Correo envio DTE</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Correo Envío", name: "correoEnvio" },
            { label: "OAuth2", name: "OAuth2" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              <input
                type="text"
                name={name}
                value={form[name] || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}
        </div>
      </section>


      {/* Sección 3: Hacienda */}
      <section className="bg-gray-200 p-6 rounded-md w-full">
        <h2 className="text-xl font-semibold mb-4">Configuración Hacienda</h2>
        <div className="grid grid-cols-3 gap-4">

           <div>
            <label className="block mb-1 font-medium">Ambiente</label>
            <ReactSelect
              options={opcionesAmbiente}
              value={selectedAmbiente}
              onChange={handleAmbienteChange}
              isClearable
              isSearchable
            />
          </div>

          {[
            { label: "URL Firmador", name: "urlFirmador" },
            { label: "Password Firmador", name: "authPassword"},
            { label: "Token Diario", name: "token_diario" },
            { label: "Password Token", name: "privatePassword"},
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              <input
                type="text"
                name={name}
                value={form[name] || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Botón de guardar */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Actualizar configuración
        </button>
      </div>
    </form>
  );
};

export default Configuracion;

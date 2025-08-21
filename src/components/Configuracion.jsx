import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import {
  listActividadEconomica19,
  listAmbiente001
} from "../api/hacienda";
import { 
  listClientData,
  updateCliente 
} from "../api/clientes";
import Loader from "../components/Loader";

const Configuracion = () => {
  const [loading, setLoading] = useState(true);
  const [actividad, setActividadEconomica] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [ambiente, setAmbiente] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
       id_actividadEconomicaFacts : "",
       name: "",
       nombreComercial: "",
       direccion: "",
       nit: "",
       nrc: "",
       company: "",
       website: "",
       ambiente: "",
       urlFirmador: "",
       authPassword: "",
       privatePassword: "",
       phone: "", 
       correoEnvio: "", 
       OAuth2: "",
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const act = await listActividadEconomica19({});
        setActividadEconomica(act.data);

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

  const handleSubmit = async (e) => {
      setSubmitting(true);
      e.preventDefault();
      try {
        const data = {
       id_actividadEconomicaFacts : form.id_actividadEconomicaFacts,
       name: form.name,
       nombreComercial: form.nombreComercial,
       direccion: form.direccion,
       nit: form.nit,
       nrc: form.nrc,
       company: form.company,
       website: form.website,
       ambiente: form.ambiente,
       urlFirmador: form.urlFirmador,
       authPassword: form.authPassword,
       privatePassword: form.privatePassword,
       phone: form.phone, 
       correoEnvio: form.correoEnvio, 
       OAuth2: form.OAuth2,
        };
  
          await updateCliente(data);
  
      } catch (error) {
        console.error("Error al guardar el producto", error);
      } finally {
        setSubmitting(false);
      }
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
              <label className="block mb-1 font-medium">OAuth2</label>
              <input
                type="password"
                name="OAuth2"
                value={form.OAuth2}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
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
            { label: "Token Diario", name: "token_diario" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              <input
                type="text"
                readOnly
                name={name}
                value={form[name] || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}

            <div>
              <label className="block mb-1 font-medium">Password Privado</label>
              <input
                type="password"
                name="privatePassword"
                value={form.privatePassword}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

             <div>
              <label className="block mb-1 font-medium">Password Token</label>
              <input
                type="password"
                name="authPassword"
                value={form.authPassword}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>


        </div>
      </section>

      {/* Botón de guardar */}
      <div className="text-right">
       <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded flex items-center justify-center gap-2 ${
                    submitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {submitting && (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {submitting
                    ? "Actualizando..."
                    : "Actualizar"}
                </button>
      </div>
    </form>
  );
};

export default Configuracion;

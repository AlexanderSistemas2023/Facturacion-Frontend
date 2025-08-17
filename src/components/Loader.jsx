const Loader = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 9999
  }}>
    <img src="/Loading.gif" alt="Cargando..." />
  </div>
);

export default Loader;

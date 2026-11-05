// Aviso flotante de éxito o error
export default function Aviso({ aviso, onCerrar }) {
  if (!aviso) return null;

  return (
    <div className={'aviso aviso-' + aviso.tipo} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
      <span className="aviso-icono">{aviso.tipo === 'exito' ? '✔' : '⚠'}</span>
      <span className="aviso-texto">{aviso.texto}</span>
      <button type="button" className="aviso-cerrar" onClick={onCerrar} aria-label="Cerrar aviso">
        ×
      </button>
    </div>
  );
}

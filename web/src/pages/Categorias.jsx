import { useEffect, useRef, useState } from 'react';
import * as api from '../api.js';
import Aviso from '../components/Aviso.jsx';
import { useAviso } from '../hooks/useAviso.js';

const FORM_VACIO = { nombre: '', descripcion: '' };

function validar(form) {
  const errores = {};
  if (form.nombre.trim() === '') errores.nombre = 'El nombre es obligatorio';
  else if (form.nombre.trim().length > 100) errores.nombre = 'Máximo 100 caracteres';
  if (form.descripcion.trim().length > 255) errores.descripcion = 'Máximo 255 caracteres';
  return errores;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const { aviso, exito, error, cerrar } = useAviso();
  const refNombre = useRef(null);

  async function cargar() {
    setCargando(true);
    setErrorCarga('');
    try {
      setCategorias(await api.obtenerCategorias());
    } catch (e) {
      setErrorCarga(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function cambiar(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrores((er) => ({ ...er, [name]: undefined }));
  }

  function limpiar() {
    setForm(FORM_VACIO);
    setErrores({});
    setEditandoId(null);
  }

  function editar(categoria) {
    setEditandoId(categoria.id_categoria);
    setForm({ nombre: categoria.nombre ?? '', descripcion: categoria.descripcion ?? '' });
    setErrores({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refNombre.current?.focus();
  }

  async function guardar(e) {
    e.preventDefault();
    const erroresValidacion = validar(form);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() === '' ? null : form.descripcion.trim(),
    };

    setGuardando(true);
    try {
      const respuesta = editandoId
        ? await api.actualizarCategoria(editandoId, datos)
        : await api.crearCategoria(datos);
      exito(respuesta?.mensaje || 'Categoría guardada correctamente');
      limpiar();
      cargar();
    } catch (e) {
      error(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(categoria) {
    if (!window.confirm('¿Seguro que deseas eliminar la categoría "' + categoria.nombre + '"?')) return;
    try {
      const respuesta = await api.eliminarCategoria(categoria.id_categoria);
      exito(respuesta?.mensaje || 'Categoría eliminada correctamente');
      if (editandoId === categoria.id_categoria) limpiar();
      cargar();
    } catch (e) {
      error(e.message);
    }
  }

  return (
    <section className="pantalla">
      <Aviso aviso={aviso} onCerrar={cerrar} />

      <div className="pantalla-titulo">
        <h2>Categorías</h2>
        <span className="contador">{categorias.length} registradas</span>
      </div>

      <div className="rejilla">
        <form className="tarjeta formulario" onSubmit={guardar} noValidate>
          <h3>{editandoId ? 'Editar categoría #' + editandoId : 'Nueva categoría'}</h3>

          <label className="campo">
            <span>Nombre <em>*</em></span>
            <input
              ref={refNombre}
              name="nombre"
              value={form.nombre}
              onChange={cambiar}
              maxLength={100}
              placeholder="Ej. Herramientas manuales"
              className={errores.nombre ? 'invalido' : ''}
            />
            {errores.nombre && <small className="error-campo">{errores.nombre}</small>}
          </label>

          <label className="campo">
            <span>Descripción</span>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={cambiar}
              maxLength={255}
              rows={3}
              placeholder="Opcional"
              className={errores.descripcion ? 'invalido' : ''}
            />
            {errores.descripcion && <small className="error-campo">{errores.descripcion}</small>}
          </label>

          <div className="acciones-form">
            <button type="submit" className="btn btn-primario" disabled={guardando}>
              {guardando ? 'Guardando…' : editandoId ? 'Actualizar' : 'Guardar'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-secundario" onClick={limpiar}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="tarjeta tabla-contenedor">
          {cargando ? (
            <p className="estado">Cargando categorías…</p>
          ) : errorCarga ? (
            <div className="estado estado-error">
              <p>{errorCarga}</p>
              <button className="btn btn-secundario" onClick={cargar}>Reintentar</button>
            </div>
          ) : categorias.length === 0 ? (
            <p className="estado">No hay categorías registradas. Crea la primera con el formulario.</p>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th className="col-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.id_categoria} className={editandoId === c.id_categoria ? 'fila-activa' : ''}>
                    <td data-label="ID" className="col-id">{c.id_categoria}</td>
                    <td data-label="Nombre"><strong>{c.nombre}</strong></td>
                    <td data-label="Descripción" className="texto-suave">{c.descripcion || '—'}</td>
                    <td className="col-acciones">
                      <button className="btn btn-editar" onClick={() => editar(c)}>Editar</button>
                      <button className="btn btn-eliminar" onClick={() => eliminar(c)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

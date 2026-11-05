import { useEffect, useRef, useState } from 'react';
import * as api from '../api.js';
import Aviso from '../components/Aviso.jsx';
import { useAviso } from '../hooks/useAviso.js';

const FORM_VACIO = { nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '' };
const STOCK_BAJO = 5;

function validar(form) {
  const errores = {};

  if (form.nombre.trim() === '') errores.nombre = 'El nombre es obligatorio';
  else if (form.nombre.trim().length > 100) errores.nombre = 'Máximo 100 caracteres';

  if (form.descripcion.trim().length > 255) errores.descripcion = 'Máximo 255 caracteres';

  if (String(form.precio).trim() === '') errores.precio = 'El precio es obligatorio';
  else if (isNaN(Number(form.precio))) errores.precio = 'Debe ser un número';
  else if (Number(form.precio) < 0) errores.precio = 'El precio no puede ser negativo';

  if (String(form.stock).trim() === '') errores.stock = 'El stock es obligatorio';
  else if (!Number.isInteger(Number(form.stock))) errores.stock = 'Debe ser un número entero';
  else if (Number(form.stock) < 0) errores.stock = 'El stock no puede ser negativo';

  if (form.id_categoria === '') errores.id_categoria = 'Selecciona una categoría';

  return errores;
}

const formatoPrecio = (valor) =>
  Number(valor).toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Productos() {
  const [productos, setProductos] = useState([]);
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
      const [listaProductos, listaCategorias] = await Promise.all([
        api.obtenerProductos(),
        api.obtenerCategorias(),
      ]);
      setProductos(listaProductos);
      setCategorias(listaCategorias);
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

  function editar(producto) {
    setEditandoId(producto.id_producto);
    setForm({
      nombre: producto.nombre ?? '',
      descripcion: producto.descripcion ?? '',
      precio: String(producto.precio ?? ''),
      stock: String(producto.stock ?? ''),
      id_categoria: String(producto.id_categoria ?? ''),
    });
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
      precio: Number(form.precio),
      stock: Number(form.stock),
      id_categoria: Number(form.id_categoria),
    };

    setGuardando(true);
    try {
      const respuesta = editandoId
        ? await api.actualizarProducto(editandoId, datos)
        : await api.crearProducto(datos);
      exito(respuesta?.mensaje || 'Producto guardado correctamente');
      limpiar();
      cargar();
    } catch (e) {
      error(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(producto) {
    if (!window.confirm('¿Seguro que deseas eliminar el producto "' + producto.nombre + '"?')) return;
    try {
      const respuesta = await api.eliminarProducto(producto.id_producto);
      exito(respuesta?.mensaje || 'Producto eliminado correctamente');
      if (editandoId === producto.id_producto) limpiar();
      cargar();
    } catch (e) {
      error(e.message);
    }
  }

  const sinCategorias = !cargando && !errorCarga && categorias.length === 0;

  return (
    <section className="pantalla">
      <Aviso aviso={aviso} onCerrar={cerrar} />

      <div className="pantalla-titulo">
        <h2>Productos</h2>
        <span className="contador">{productos.length} en inventario</span>
      </div>

      <div className="rejilla">
        <form className="tarjeta formulario" onSubmit={guardar} noValidate>
          <h3>{editandoId ? 'Editar producto #' + editandoId : 'Nuevo producto'}</h3>

          <label className="campo">
            <span>Nombre <em>*</em></span>
            <input
              ref={refNombre}
              name="nombre"
              value={form.nombre}
              onChange={cambiar}
              maxLength={100}
              placeholder="Ej. Martillo"
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
              rows={2}
              placeholder="Opcional"
              className={errores.descripcion ? 'invalido' : ''}
            />
            {errores.descripcion && <small className="error-campo">{errores.descripcion}</small>}
          </label>

          <div className="campos-dobles">
            <label className="campo">
              <span>Precio <em>*</em></span>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={cambiar}
                min="0"
                step="0.01"
                placeholder="0.00"
                className={errores.precio ? 'invalido' : ''}
              />
              {errores.precio && <small className="error-campo">{errores.precio}</small>}
            </label>

            <label className="campo">
              <span>Stock <em>*</em></span>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={cambiar}
                min="0"
                step="1"
                placeholder="0"
                className={errores.stock ? 'invalido' : ''}
              />
              {errores.stock && <small className="error-campo">{errores.stock}</small>}
            </label>
          </div>

          <label className="campo">
            <span>Categoría <em>*</em></span>
            <select
              name="id_categoria"
              value={form.id_categoria}
              onChange={cambiar}
              disabled={categorias.length === 0}
              className={errores.id_categoria ? 'invalido' : ''}
            >
              <option value="">
                {categorias.length === 0 ? 'No hay categorías disponibles' : '— Selecciona una categoría —'}
              </option>
              {categorias.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errores.id_categoria && <small className="error-campo">{errores.id_categoria}</small>}
            {sinCategorias && (
              <small className="ayuda">Primero crea una categoría en la pantalla Categorías.</small>
            )}
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
            <p className="estado">Cargando productos…</p>
          ) : errorCarga ? (
            <div className="estado estado-error">
              <p>{errorCarga}</p>
              <button className="btn btn-secundario" onClick={cargar}>Reintentar</button>
            </div>
          ) : productos.length === 0 ? (
            <p className="estado">No hay productos registrados. Agrega el primero con el formulario.</p>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th className="num">Precio</th>
                  <th className="num">Stock</th>
                  <th className="col-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id_producto} className={editandoId === p.id_producto ? 'fila-activa' : ''}>
                    <td data-label="ID" className="col-id">{p.id_producto}</td>
                    <td data-label="Producto">
                      <strong>{p.nombre}</strong>
                      {p.descripcion && <div className="texto-suave">{p.descripcion}</div>}
                    </td>
                    <td data-label="Categoría">
                      <span className="etiqueta">{p.categoria}</span>
                    </td>
                    <td data-label="Precio" className="num">{formatoPrecio(p.precio)}</td>
                    <td data-label="Stock" className="num">
                      <span className={'stock' + (p.stock <= STOCK_BAJO ? ' stock-bajo' : '')}>{p.stock}</span>
                    </td>
                    <td className="col-acciones">
                      <button className="btn btn-editar" onClick={() => editar(p)}>Editar</button>
                      <button className="btn btn-eliminar" onClick={() => eliminar(p)}>Eliminar</button>
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

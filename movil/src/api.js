// =====================================================
// api.js — Todas las llamadas a la API pasan por aquí.
// Mismo formato que la web (web/src/api.js). La URL está en src/config.js.
// =====================================================
import { API_URL } from './config';

const URL_BASE = API_URL.replace(/\/+$/, '');

// Tiempo máximo de espera por petición (milisegundos)
const TIEMPO_ESPERA = 8000;

async function peticion(ruta, opciones = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_ESPERA);

  let respuesta;
  try {
    respuesta = await fetch(URL_BASE + ruta, {
      ...opciones,
      headers: { 'Content-Type': 'application/json', ...(opciones.headers || {}) },
      signal: controlador.signal,
    });
  } catch {
    // Sin respuesta: servidor apagado, IP incorrecta, otra red WiFi o tiempo agotado
    throw new Error(
      'No hay conexión con el servidor (' + URL_BASE + '). ' +
        'Verifica que el backend esté encendido, que la IP en src/config.js sea correcta ' +
        'y que el celular esté en la misma red WiFi.'
    );
  } finally {
    clearTimeout(temporizador);
  }

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    // El backend envía los errores como { mensaje: '...' }
    throw new Error((datos && datos.mensaje) || 'Error ' + respuesta.status + ' en la petición');
  }

  return datos;
}

// ===================== CATEGORÍAS =====================
// Categoría: { id_categoria, nombre, descripcion }

export const obtenerCategorias = () => peticion('/categorias');

export const crearCategoria = (categoria) =>
  peticion('/categorias', { method: 'POST', body: JSON.stringify(categoria) });

export const actualizarCategoria = (id, categoria) =>
  peticion('/categorias/' + id, { method: 'PUT', body: JSON.stringify(categoria) });

export const eliminarCategoria = (id) => peticion('/categorias/' + id, { method: 'DELETE' });

// ===================== PRODUCTOS =====================
// Producto (GET): { id_producto, nombre, descripcion, precio, stock, id_categoria, categoria }
// "categoria" es el NOMBRE de la categoría (viene del JOIN en el backend).

export const obtenerProductos = () => peticion('/productos');

export const crearProducto = (producto) =>
  peticion('/productos', { method: 'POST', body: JSON.stringify(producto) });

export const actualizarProducto = (id, producto) =>
  peticion('/productos/' + id, { method: 'PUT', body: JSON.stringify(producto) });

export const eliminarProducto = (id) => peticion('/productos/' + id, { method: 'DELETE' });

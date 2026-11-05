// =====================================================
// api.js — Todas las llamadas a la API pasan por aquí.
// La URL base se configura en el archivo .env (VITE_API_URL).
// =====================================================

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/+$/, '');

// Tiempo máximo de espera por petición (milisegundos)
const TIEMPO_ESPERA = 8000;

// Función base: hace la petición, interpreta la respuesta y lanza
// un Error con un mensaje claro si algo sale mal.
async function peticion(ruta, opciones = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_ESPERA);

  let respuesta;
  try {
    respuesta = await fetch(API_URL + ruta, {
      ...opciones,
      headers: { 'Content-Type': 'application/json', ...(opciones.headers || {}) },
      signal: controlador.signal,
    });
  } catch {
    // fetch solo falla aquí si no hubo respuesta (servidor apagado, IP incorrecta, sin red o tiempo agotado)
    throw new Error(
      'No se pudo conectar con la API (' + API_URL + '). ' +
      'Verifica que el servidor esté encendido y que la IP del archivo .env sea correcta.'
    );
  } finally {
    clearTimeout(temporizador);
  }

  // El backend responde siempre en JSON; si no, dejamos datos en null
  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    const mensaje = (datos && datos.mensaje) || 'Error ' + respuesta.status + ' en la petición';
    throw new Error(mensaje);
  }

  return datos;
}

// ===================== CATEGORÍAS =====================
// Categoría: { id_categoria, nombre, descripcion }

export const obtenerCategorias = () => peticion('/categorias');

export const obtenerCategoria = (id) => peticion('/categorias/' + id);

export const crearCategoria = (categoria) =>
  peticion('/categorias', { method: 'POST', body: JSON.stringify(categoria) });

export const actualizarCategoria = (id, categoria) =>
  peticion('/categorias/' + id, { method: 'PUT', body: JSON.stringify(categoria) });

export const eliminarCategoria = (id) => peticion('/categorias/' + id, { method: 'DELETE' });

// ===================== PRODUCTOS =====================
// Producto (GET): { id_producto, nombre, descripcion, precio, stock, id_categoria, categoria }
// "categoria" es el NOMBRE de la categoría (viene del JOIN en el backend).

export const obtenerProductos = () => peticion('/productos');

export const obtenerProducto = (id) => peticion('/productos/' + id);

export const crearProducto = (producto) =>
  peticion('/productos', { method: 'POST', body: JSON.stringify(producto) });

export const actualizarProducto = (id, producto) =>
  peticion('/productos/' + id, { method: 'PUT', body: JSON.stringify(producto) });

export const eliminarProducto = (id) => peticion('/productos/' + id, { method: 'DELETE' });

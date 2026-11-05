import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import * as api from '../api';
import Aviso from '../components/Aviso';
import Campo from '../components/Campo';
import HojaFormulario from '../components/HojaFormulario';
import SelectorCategoria from '../components/SelectorCategoria';
import { AccionesFila, BotonAgregar, EstadoLista, TituloLista, estilosTarjeta } from '../components/Comunes';
import { useAviso } from '../hooks/useAviso';
import { colores } from '../tema';

const FORM_VACIO = { nombre: '', descripcion: '', precio: '', stock: '', id_categoria: null };
const STOCK_BAJO = 5;

// Acepta coma o punto como separador decimal
const aNumero = (texto) => Number(String(texto).trim().replace(',', '.'));

function validar(form) {
  const errores = {};

  if (form.nombre.trim() === '') errores.nombre = 'El nombre es obligatorio';
  else if (form.nombre.trim().length > 100) errores.nombre = 'Máximo 100 caracteres';

  if (form.descripcion.trim().length > 255) errores.descripcion = 'Máximo 255 caracteres';

  if (form.precio.trim() === '') errores.precio = 'El precio es obligatorio';
  else if (isNaN(aNumero(form.precio))) errores.precio = 'Debe ser un número';
  else if (aNumero(form.precio) < 0) errores.precio = 'No puede ser negativo';

  if (form.stock.trim() === '') errores.stock = 'El stock es obligatorio';
  else if (!Number.isInteger(aNumero(form.stock))) errores.stock = 'Debe ser un número entero';
  else if (aNumero(form.stock) < 0) errores.stock = 'No puede ser negativo';

  if (form.id_categoria === null) errores.id_categoria = 'Selecciona una categoría';

  return errores;
}

const formatoPrecio = (valor) => Number(valor).toFixed(2);

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');

  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const { aviso, exito, error, cerrar } = useAviso();

  const cargar = useCallback(async () => {
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
      setRefrescando(false);
    }
  }, []);

  // Recarga los datos cada vez que se entra a esta pestaña
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  function refrescar() {
    setRefrescando(true);
    cargar();
  }

  function reintentar() {
    setCargando(true);
    cargar();
  }

  async function abrirNuevo() {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setErrores({});
    setErrorGeneral('');
    setFormVisible(true);
    // Recargar categorías por si se crearon nuevas en la otra pestaña
    try {
      setCategorias(await api.obtenerCategorias());
    } catch {
      /* si falla, se usan las que ya estaban cargadas */
    }
  }

  async function abrirEditar(p) {
    setEditandoId(p.id_producto);
    setForm({
      nombre: p.nombre ?? '',
      descripcion: p.descripcion ?? '',
      precio: String(p.precio ?? ''),
      stock: String(p.stock ?? ''),
      id_categoria: p.id_categoria ?? null,
    });
    setErrores({});
    setErrorGeneral('');
    setFormVisible(true);
    try {
      setCategorias(await api.obtenerCategorias());
    } catch {
      /* se usan las categorías ya cargadas */
    }
  }

  function cambiar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErrores((er) => ({ ...er, [campo]: undefined }));
  }

  async function guardar() {
    const erroresValidacion = validar(form);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    // Mismo formato JSON que espera el backend
    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() === '' ? null : form.descripcion.trim(),
      precio: aNumero(form.precio),
      stock: aNumero(form.stock),
      id_categoria: Number(form.id_categoria),
    };

    setGuardando(true);
    setErrorGeneral('');
    try {
      const respuesta = editandoId
        ? await api.actualizarProducto(editandoId, datos)
        : await api.crearProducto(datos);
      setFormVisible(false);
      exito(respuesta?.mensaje || 'Producto guardado correctamente');
      cargar();
    } catch (e) {
      setErrorGeneral(e.message);
    } finally {
      setGuardando(false);
    }
  }

  function confirmarEliminar(p) {
    Alert.alert('Eliminar producto', '¿Seguro que deseas eliminar "' + p.nombre + '"?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const respuesta = await api.eliminarProducto(p.id_producto);
            exito(respuesta?.mensaje || 'Producto eliminado correctamente');
            cargar();
          } catch (e) {
            error(e.message);
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.pantalla}>
      <Aviso aviso={aviso} onCerrar={cerrar} />

      <FlatList
        data={errorCarga ? [] : productos}
        keyExtractor={(p) => String(p.id_producto)}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={refrescar}
            colors={[colores.naranja]}
            tintColor={colores.naranja}
          />
        }
        ListHeaderComponent={
          <TituloLista titulo="Productos" detalle={cargando || errorCarga ? '' : productos.length + ' en inventario'} />
        }
        ListEmptyComponent={
          <EstadoLista
            cargando={cargando}
            error={errorCarga}
            vacio={!cargando && !errorCarga && productos.length === 0}
            textoVacio="No hay productos. Toca el botón + para agregar el primero."
            onReintentar={reintentar}
          />
        }
        renderItem={({ item }) => {
          const bajo = item.stock <= STOCK_BAJO;
          return (
            <View style={[estilosTarjeta.tarjeta, styles.tarjetaProducto]}>
              <View style={styles.cabeceraTarjeta}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.precio}>{formatoPrecio(item.precio)}</Text>
              </View>
              {item.descripcion ? <Text style={styles.descripcion}>{item.descripcion}</Text> : null}
              <View style={styles.detalles}>
                <View style={styles.etiqueta}>
                  <Text style={styles.textoEtiqueta}>{item.categoria}</Text>
                </View>
                <View style={[styles.stock, bajo && styles.stockBajo]}>
                  <Text style={[styles.textoStock, bajo && styles.textoStockBajo]}>Stock: {item.stock}</Text>
                </View>
              </View>
              <AccionesFila onEditar={() => abrirEditar(item)} onEliminar={() => confirmarEliminar(item)} />
            </View>
          );
        }}
      />

      <BotonAgregar onPress={abrirNuevo} />

      <HojaFormulario
        visible={formVisible}
        titulo={editandoId ? 'Editar producto #' + editandoId : 'Nuevo producto'}
        guardando={guardando}
        errorGeneral={errorGeneral}
        onGuardar={guardar}
        onCancelar={() => setFormVisible(false)}
      >
        <Campo
          etiqueta="Nombre"
          obligatorio
          value={form.nombre}
          onChangeText={(v) => cambiar('nombre', v)}
          placeholder="Ej. Martillo"
          maxLength={100}
          error={errores.nombre}
        />
        <Campo
          etiqueta="Descripción"
          value={form.descripcion}
          onChangeText={(v) => cambiar('descripcion', v)}
          placeholder="Opcional"
          maxLength={255}
          multiline
          error={errores.descripcion}
        />
        <View style={styles.dosColumnas}>
          <Campo
            style={styles.columna}
            etiqueta="Precio"
            obligatorio
            value={form.precio}
            onChangeText={(v) => cambiar('precio', v)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            error={errores.precio}
          />
          <Campo
            style={styles.columna}
            etiqueta="Stock"
            obligatorio
            value={form.stock}
            onChangeText={(v) => cambiar('stock', v)}
            placeholder="0"
            keyboardType="number-pad"
            error={errores.stock}
          />
        </View>
        <SelectorCategoria
          categorias={categorias}
          valor={form.id_categoria}
          onCambiar={(id) => cambiar('id_categoria', id)}
          error={errores.id_categoria}
        />
      </HojaFormulario>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  lista: { padding: 14, paddingBottom: 96 },
  tarjetaProducto: { borderLeftColor: colores.naranja },
  cabeceraTarjeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  nombre: { fontSize: 16, fontWeight: '700', color: colores.acero900, flex: 1 },
  precio: { fontSize: 16, fontWeight: '700', color: colores.acero800 },
  descripcion: { fontSize: 13.5, color: colores.acero500, marginTop: 3 },
  detalles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  etiqueta: {
    backgroundColor: colores.acero100,
    borderWidth: 1,
    borderColor: colores.acero300,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  textoEtiqueta: { fontSize: 12.5, color: colores.acero800 },
  stock: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: colores.verdeClaro },
  stockBajo: { backgroundColor: colores.rojoClaro },
  textoStock: { fontSize: 12.5, fontWeight: '600', color: colores.verde },
  textoStockBajo: { color: colores.rojo },
  dosColumnas: { flexDirection: 'row', gap: 12 },
  columna: { flex: 1 },
});

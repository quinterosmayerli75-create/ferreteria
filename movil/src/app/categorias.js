import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import * as api from '../api';
import Aviso from '../components/Aviso';
import Campo from '../components/Campo';
import HojaFormulario from '../components/HojaFormulario';
import { AccionesFila, BotonAgregar, EstadoLista, TituloLista, estilosTarjeta } from '../components/Comunes';
import { useAviso } from '../hooks/useAviso';
import { colores } from '../tema';

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
      setCategorias(await api.obtenerCategorias());
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

  function abrirNuevo() {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setErrores({});
    setErrorGeneral('');
    setFormVisible(true);
  }

  function abrirEditar(c) {
    setEditandoId(c.id_categoria);
    setForm({ nombre: c.nombre ?? '', descripcion: c.descripcion ?? '' });
    setErrores({});
    setErrorGeneral('');
    setFormVisible(true);
  }

  function cambiar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErrores((er) => ({ ...er, [campo]: undefined }));
  }

  async function guardar() {
    const erroresValidacion = validar(form);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() === '' ? null : form.descripcion.trim(),
    };

    setGuardando(true);
    setErrorGeneral('');
    try {
      const respuesta = editandoId
        ? await api.actualizarCategoria(editandoId, datos)
        : await api.crearCategoria(datos);
      setFormVisible(false);
      exito(respuesta?.mensaje || 'Categoría guardada correctamente');
      cargar();
    } catch (e) {
      // El error se muestra dentro del formulario para no perder lo escrito
      setErrorGeneral(e.message);
    } finally {
      setGuardando(false);
    }
  }

  function confirmarEliminar(c) {
    Alert.alert('Eliminar categoría', '¿Seguro que deseas eliminar "' + c.nombre + '"?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const respuesta = await api.eliminarCategoria(c.id_categoria);
            exito(respuesta?.mensaje || 'Categoría eliminada correctamente');
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
        data={errorCarga ? [] : categorias}
        keyExtractor={(c) => String(c.id_categoria)}
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
          <TituloLista titulo="Categorías" detalle={cargando || errorCarga ? '' : categorias.length + ' registradas'} />
        }
        ListEmptyComponent={
          <EstadoLista
            cargando={cargando}
            error={errorCarga}
            vacio={!cargando && !errorCarga && categorias.length === 0}
            textoVacio="No hay categorías. Toca el botón + para crear la primera."
            onReintentar={reintentar}
          />
        }
        renderItem={({ item }) => (
          <View style={estilosTarjeta.tarjeta}>
            <View style={styles.cabeceraTarjeta}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.id}>#{item.id_categoria}</Text>
            </View>
            <Text style={styles.descripcion}>{item.descripcion || 'Sin descripción'}</Text>
            <AccionesFila onEditar={() => abrirEditar(item)} onEliminar={() => confirmarEliminar(item)} />
          </View>
        )}
      />

      <BotonAgregar onPress={abrirNuevo} />

      <HojaFormulario
        visible={formVisible}
        titulo={editandoId ? 'Editar categoría #' + editandoId : 'Nueva categoría'}
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
          placeholder="Ej. Herramientas manuales"
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
      </HojaFormulario>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  lista: { padding: 14, paddingBottom: 96 },
  cabeceraTarjeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  nombre: { fontSize: 16, fontWeight: '700', color: colores.acero900, flex: 1 },
  id: { fontSize: 12.5, color: colores.acero500 },
  descripcion: { fontSize: 13.5, color: colores.acero500, marginTop: 4 },
});

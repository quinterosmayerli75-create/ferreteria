import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colores } from '../tema';
import { estilosCampo } from './Campo';

// Selector de categoría: muestra la lista (cargada desde la API) en una ventana.
export default function SelectorCategoria({ categorias, valor, onCambiar, error }) {
  const [abierto, setAbierto] = useState(false);
  const insets = useSafeAreaInsets();
  const seleccionada = categorias.find((c) => c.id_categoria === valor);
  const sinCategorias = categorias.length === 0;

  return (
    <View style={styles.campo}>
      <Text style={estilosCampo.etiqueta}>
        Categoría<Text style={estilosCampo.asterisco}> *</Text>
      </Text>

      <Pressable
        style={[estilosCampo.input, styles.boton, error && estilosCampo.invalido, sinCategorias && styles.deshabilitado]}
        onPress={() => !sinCategorias && setAbierto(true)}
      >
        <Text style={[styles.textoBoton, !seleccionada && styles.placeholder]} numberOfLines={1}>
          {seleccionada
            ? seleccionada.nombre
            : sinCategorias
              ? 'No hay categorías (crea una primero)'
              : 'Selecciona una categoría'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colores.acero500} />
      </Pressable>
      {error ? <Text style={estilosCampo.error}>{error}</Text> : null}

      <Modal visible={abierto} transparent animationType="fade" onRequestClose={() => setAbierto(false)}>
        <Pressable style={styles.fondo} onPress={() => setAbierto(false)}>
          <Pressable style={[styles.ventana, { marginBottom: insets.bottom + 20 }]} onPress={() => {}}>
            <Text style={styles.titulo}>Selecciona una categoría</Text>
            <FlatList
              data={categorias}
              keyExtractor={(c) => String(c.id_categoria)}
              renderItem={({ item }) => {
                const activa = item.id_categoria === valor;
                return (
                  <Pressable
                    style={({ pressed }) => [styles.opcion, activa && styles.opcionActiva, pressed && styles.presionada]}
                    onPress={() => {
                      onCambiar(item.id_categoria);
                      setAbierto(false);
                    }}
                  >
                    <Text style={[styles.textoOpcion, activa && styles.textoActivo]}>{item.nombre}</Text>
                    {activa && <Ionicons name="checkmark" size={20} color={colores.naranjaOscuro} />}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  campo: { marginBottom: 14 },
  boton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deshabilitado: { backgroundColor: colores.acero100 },
  textoBoton: { flex: 1, fontSize: 15, color: colores.acero900 },
  placeholder: { color: colores.acero500 },
  fondo: { flex: 1, backgroundColor: 'rgba(31,41,51,0.5)', justifyContent: 'center', padding: 20 },
  ventana: {
    backgroundColor: colores.blanco,
    borderRadius: 10,
    maxHeight: '70%',
    overflow: 'hidden',
    borderTopWidth: 4,
    borderTopColor: colores.naranja,
  },
  titulo: { fontSize: 16, fontWeight: '700', padding: 16, color: colores.acero900 },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colores.acero100,
  },
  opcionActiva: { backgroundColor: '#fef3c7' },
  presionada: { backgroundColor: colores.acero100 },
  textoOpcion: { fontSize: 15, color: colores.acero800 },
  textoActivo: { fontWeight: '700', color: colores.acero900 },
});

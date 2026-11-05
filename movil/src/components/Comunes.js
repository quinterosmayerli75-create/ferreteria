import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colores, sombra } from '../tema';

// Mensaje central para "cargando", "error" o "lista vacía"
export function EstadoLista({ cargando, error, vacio, textoVacio, onReintentar }) {
  if (cargando) {
    return (
      <View style={styles.estado}>
        <ActivityIndicator size="large" color={colores.naranja} />
        <Text style={styles.textoEstado}>Cargando…</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.estado}>
        <Ionicons name="cloud-offline-outline" size={46} color={colores.rojo} />
        <Text style={[styles.textoEstado, { color: colores.rojo }]}>{error}</Text>
        <Pressable style={styles.reintentar} onPress={onReintentar}>
          <Text style={styles.textoReintentar}>Reintentar</Text>
        </Pressable>
        <Text style={styles.pista}>También puedes deslizar hacia abajo para recargar.</Text>
      </View>
    );
  }
  if (vacio) {
    return (
      <View style={styles.estado}>
        <Ionicons name="file-tray-outline" size={46} color={colores.acero500} />
        <Text style={styles.textoEstado}>{textoVacio}</Text>
      </View>
    );
  }
  return null;
}

// Botón flotante redondo "+"
export function BotonAgregar({ onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.fab, pressed && { backgroundColor: colores.naranjaOscuro }]}
      onPress={onPress}
      accessibilityLabel="Agregar"
    >
      <Ionicons name="add" size={30} color={colores.acero900} />
    </Pressable>
  );
}

// Botones pequeños Editar / Eliminar
export function AccionesFila({ onEditar, onEliminar }) {
  return (
    <View style={styles.acciones}>
      <Pressable style={({ pressed }) => [styles.accion, styles.editar, pressed && { opacity: 0.7 }]} onPress={onEditar}>
        <Ionicons name="create-outline" size={16} color={colores.azul} />
        <Text style={[styles.textoAccion, { color: colores.azul }]}>Editar</Text>
      </Pressable>
      <Pressable style={({ pressed }) => [styles.accion, styles.eliminar, pressed && { opacity: 0.7 }]} onPress={onEliminar}>
        <Ionicons name="trash-outline" size={16} color={colores.rojo} />
        <Text style={[styles.textoAccion, { color: colores.rojo }]}>Eliminar</Text>
      </Pressable>
    </View>
  );
}

// Encabezado de la lista: título y contador
export function TituloLista({ titulo, detalle }) {
  return (
    <View style={styles.tituloLista}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.detalle}>{detalle}</Text>
    </View>
  );
}

export const estilosTarjeta = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.blanco,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colores.acero700,
    ...sombra,
  },
});

const styles = StyleSheet.create({
  estado: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 24, gap: 12 },
  textoEstado: { textAlign: 'center', color: colores.acero500, fontSize: 14.5 },
  reintentar: {
    backgroundColor: colores.blanco,
    borderWidth: 1,
    borderColor: colores.acero300,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  textoReintentar: { fontWeight: '600', color: colores.acero800 },
  pista: { fontSize: 12.5, color: colores.acero500 },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colores.naranja,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  acciones: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 },
  accion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  editar: { backgroundColor: colores.azulClaro },
  eliminar: { backgroundColor: colores.rojoClaro },
  textoAccion: { fontSize: 13, fontWeight: '600' },
  tituloLista: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: colores.naranja,
    paddingLeft: 10,
  },
  titulo: { fontSize: 20, fontWeight: '700', color: colores.acero900 },
  detalle: { fontSize: 13.5, color: colores.acero500 },
});

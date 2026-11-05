import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colores } from '../tema';

// Aviso flotante (parte superior de la pantalla). Se cierra solo o al tocarlo.
export default function Aviso({ aviso, onCerrar }) {
  const animacion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (aviso) {
      animacion.setValue(0);
      Animated.timing(animacion, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    }
  }, [aviso, animacion]);

  if (!aviso) return null;

  const esExito = aviso.tipo === 'exito';

  return (
    <Animated.View
      style={[
        styles.contenedor,
        esExito ? styles.exito : styles.error,
        {
          opacity: animacion,
          transform: [{ translateY: animacion.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        },
      ]}
    >
      <Pressable style={styles.fila} onPress={onCerrar} accessibilityRole="alert">
        <Ionicons
          name={esExito ? 'checkmark-circle' : 'warning'}
          size={22}
          color={esExito ? colores.verde : colores.rojo}
        />
        <Text style={[styles.texto, { color: esExito ? colores.verde : colores.rojo }]}>{aviso.texto}</Text>
        <Ionicons name="close" size={18} color={esExito ? colores.verde : colores.rojo} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    zIndex: 100,
    elevation: 6,
    borderRadius: 8,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  exito: { backgroundColor: colores.verdeClaro, borderLeftColor: colores.verde },
  error: { backgroundColor: colores.rojoClaro, borderLeftColor: colores.rojo },
  texto: { flex: 1, fontSize: 14, fontWeight: '500' },
});

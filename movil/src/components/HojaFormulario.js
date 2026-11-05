import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colores } from '../tema';

// Ventana que sube desde abajo con el formulario de crear / editar.
export default function HojaFormulario({ visible, titulo, guardando, errorGeneral, onGuardar, onCancelar, children }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancelar}>
      <KeyboardAvoidingView style={styles.fondo} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable style={styles.cerrarArea} onPress={onCancelar} />
        <View style={[styles.hoja, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.asa} />
          <Text style={styles.titulo}>{titulo}</Text>

          <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll}>
            {errorGeneral ? (
              <View style={styles.errorGeneral}>
                <Text style={styles.textoErrorGeneral}>{errorGeneral}</Text>
              </View>
            ) : null}
            {children}
          </ScrollView>

          <View style={styles.botones}>
            <Pressable
              style={({ pressed }) => [styles.boton, styles.cancelar, pressed && { opacity: 0.7 }]}
              onPress={onCancelar}
              disabled={guardando}
            >
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.boton, styles.guardar, (pressed || guardando) && { opacity: 0.7 }]}
              onPress={onGuardar}
              disabled={guardando}
            >
              {guardando ? (
                <ActivityIndicator color={colores.acero900} />
              ) : (
                <Text style={styles.textoGuardar}>Guardar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(31,41,51,0.5)', justifyContent: 'flex-end' },
  cerrarArea: { flex: 1 },
  hoja: {
    backgroundColor: colores.blanco,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 4,
    borderTopColor: colores.naranja,
    paddingHorizontal: 18,
    paddingTop: 8,
    maxHeight: '90%',
  },
  asa: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colores.acero300,
    marginBottom: 10,
  },
  titulo: { fontSize: 18, fontWeight: '700', color: colores.acero900, marginBottom: 14 },
  scroll: { flexGrow: 0 },
  errorGeneral: {
    backgroundColor: colores.rojoClaro,
    borderLeftWidth: 4,
    borderLeftColor: colores.rojo,
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
  },
  textoErrorGeneral: { color: colores.rojo, fontSize: 13.5 },
  botones: { flexDirection: 'row', gap: 10, marginTop: 6 },
  boton: { flex: 1, paddingVertical: 13, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cancelar: { backgroundColor: colores.acero100, borderWidth: 1, borderColor: colores.acero300 },
  guardar: { backgroundColor: colores.naranja },
  textoCancelar: { fontWeight: '600', color: colores.acero800, fontSize: 15 },
  textoGuardar: { fontWeight: '700', color: colores.acero900, fontSize: 15 },
});

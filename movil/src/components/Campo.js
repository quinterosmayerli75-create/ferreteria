import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colores } from '../tema';

// Campo de formulario con etiqueta y mensaje de error
export default function Campo({ etiqueta, obligatorio, error, style, ...props }) {
  return (
    <View style={[styles.campo, style]}>
      <Text style={styles.etiqueta}>
        {etiqueta}
        {obligatorio && <Text style={styles.asterisco}> *</Text>}
      </Text>
      <TextInput
        placeholderTextColor={colores.acero500}
        style={[styles.input, props.multiline && styles.multilinea, error && styles.invalido]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const base = {
  etiqueta: { fontSize: 13, fontWeight: '600', color: colores.acero700, marginBottom: 5 },
  asterisco: { color: colores.rojo },
  input: {
    borderWidth: 1,
    borderColor: colores.acero300,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colores.acero900,
    backgroundColor: colores.blanco,
  },
  invalido: { borderColor: colores.rojo },
  error: { color: colores.rojo, fontSize: 12.5, marginTop: 4 },
};

export const estilosCampo = StyleSheet.create(base);

const styles = StyleSheet.create({
  campo: { marginBottom: 14 },
  ...base,
  multilinea: { minHeight: 70, textAlignVertical: 'top' },
});

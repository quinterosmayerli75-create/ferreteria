import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colores } from '../tema';

// Franja de advertencia amarilla y negra (igual que en la web)
function FondoCabecera() {
  return (
    <View style={styles.fondoCabecera}>
      <View style={styles.franja}>
        {Array.from({ length: 40 }).map((_, i) => (
          <View key={i} style={[styles.raya, { backgroundColor: i % 2 === 0 ? colores.amarillo : colores.acero900 }]} />
        ))}
      </View>
    </View>
  );
}

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerBackground: () => <FondoCabecera />,
          headerTintColor: colores.blanco,
          headerTitleStyle: { fontWeight: '700', letterSpacing: 0.5 },
          tabBarActiveTintColor: colores.naranjaOscuro,
          tabBarInactiveTintColor: colores.acero500,
          tabBarStyle: { backgroundColor: colores.blanco, borderTopColor: colores.acero300 },
          tabBarLabelStyle: { fontWeight: '600' },
          sceneStyle: { backgroundColor: colores.fondo },
        }}
      >
        <Tabs.Screen
          name="categorias"
          options={{
            title: 'Categorías',
            headerTitle: '🔧 Ferretería · Categorías',
            tabBarIcon: ({ color, size }) => <Ionicons name="pricetags" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="productos"
          options={{
            title: 'Productos',
            headerTitle: '🔧 Ferretería · Productos',
            tabBarIcon: ({ color, size }) => <Ionicons name="hammer" size={size} color={color} />,
          }}
        />
        {/* La ruta inicial solo redirige; no aparece como pestaña */}
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  fondoCabecera: { flex: 1, backgroundColor: colores.acero900, justifyContent: 'flex-end' },
  franja: { flexDirection: 'row', height: 6, overflow: 'hidden' },
  raya: { width: 14, height: 12, transform: [{ skewX: '-45deg' }] },
});

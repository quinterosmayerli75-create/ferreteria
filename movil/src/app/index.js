import { Redirect } from 'expo-router';

// Al abrir la app se muestra directamente la pestaña Productos
export default function Inicio() {
  return <Redirect href="/productos" />;
}

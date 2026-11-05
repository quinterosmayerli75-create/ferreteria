// =====================================================
// CONFIGURACIÓN DE LA API
// =====================================================
// IMPORTANTE: el celular NO entiende "localhost" (para el celular,
// localhost es el propio celular). Hay que usar la IP de la PC donde
// corre el backend, y ambos deben estar en la misma red WiFi.
//
// Si la IP de la PC cambia (pasa a menudo al reconectarse al WiFi),
// actualiza este valor. Para ver la IP en Windows: abre una terminal,
// ejecuta "ipconfig" y busca la "Dirección IPv4" del adaptador Wi-Fi.
// La consola del backend también la muestra al iniciar ("Red: http://...").
// =====================================================

export const API_URL = 'http://192.168.1.6:3000/api';

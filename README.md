# 🔧 Sistema de Gestión de Ferretería

API RESTful con Node.js + Express + MySQL, frontend web en React y aplicación móvil.

## 👥 Integrantes
- **Mayerli Quinteros**: Base de datos, API RESTful y pruebas
- **[Nombre de tu compañera]**: Frontend web y aplicación móvil

## 📁 Estructura
```
ferreteria/
├── database/   → Script SQL de la base de datos
├── backend/    → API en Node.js + Express
├── web/        → Frontend en React
└── movil/      → Aplicación móvil
```

## ⚙️ Backend

### Requisitos
- Node.js
- MySQL (XAMPP)

### Instalación
1. Encender MySQL en XAMPP.
2. Ejecutar el script `database/ferreteria.sql` en phpMyAdmin.
3. Instalar dependencias:
   ```
   cd backend
   npm install
   ```
4. Copiar `.env.example` como `.env` y configurar los datos de MySQL.
5. Iniciar el servidor:
   ```
   npm run dev
   ```

### Endpoints
| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/categorias | Listar categorías |
| GET | /api/categorias/:id | Obtener una categoría |
| POST | /api/categorias | Crear categoría |
| PUT | /api/categorias/:id | Actualizar categoría |
| DELETE | /api/categorias/:id | Eliminar categoría |
| GET | /api/productos | Listar productos con su categoría |
| GET | /api/productos/:id | Obtener un producto |
| POST | /api/productos | Crear producto |
| PUT | /api/productos/:id | Actualizar producto |
| DELETE | /api/productos/:id | Eliminar producto |

### Ejemplo de JSON (producto)
```json
{
  "nombre": "Martillo",
  "descripcion": "Mango de madera",
  "precio": 45.50,
  "stock": 20,
  "id_categoria": 1
}
```

### Acceso en red
El servidor escucha en `0.0.0.0:3000`. Desde otros dispositivos conectados a la misma red se accede con:
```
http://IP_DEL_SERVIDOR:3000/api
```
Al iniciar el servidor, la consola muestra la IP de la red.

### Pruebas
La colección de Postman está en `backend/postman_collection.json`. Se importa en Postman con **Import**.

## 🖥️ Frontend web

Aplicación en **React + Vite** (carpeta `web/`) con dos pantallas: **Categorías** y **Productos** (listar, crear, editar y eliminar).

### Requisitos
- Node.js
- El backend encendido (ver sección anterior)

### Ejecución
1. Instalar dependencias:
   ```
   cd web
   npm install
   ```
2. Configurar la URL de la API: copiar `.env.example` como `.env` (si no existe) y poner la IP del servidor donde corre el backend:
   ```
   VITE_API_URL=http://192.168.1.4:3000/api
   ```
   Si el backend corre en la misma PC se puede usar `http://localhost:3000/api`.
   Después de cambiar el `.env` hay que reiniciar `npm run dev`.
3. Iniciar el frontend:
   ```
   npm run dev
   ```
4. Abrir en el navegador `http://localhost:5173`.

### Acceso desde otras PCs de la red
Para abrir la web desde otras computadoras conectadas a la misma red:
```
npm run dev -- --host
```
La consola mostrará una dirección tipo `http://192.168.1.X:5173` que se puede abrir desde cualquier PC de la red.

### Estructura
```
web/
├── .env.example        → Plantilla de configuración (URL de la API)
├── index.html
└── src/
    ├── api.js          → Todas las llamadas a la API (fetch)
    ├── App.jsx         → Menú superior y rutas
    ├── index.css       → Estilos
    ├── components/     → Aviso (mensajes de éxito/error)
    ├── hooks/          → useAviso (avisos que desaparecen solos)
    └── pages/          → Categorias.jsx y Productos.jsx
```

## 📱 Aplicación móvil

Aplicación en **React Native + Expo** (SDK 58, carpeta `movil/`) con dos pestañas: **Categorías** y **Productos** (listar, crear, editar, eliminar y deslizar hacia abajo para refrescar).

### Requisitos
- Node.js en la PC
- La app **Expo Go** instalada en el celular ([Android – Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iPhone – App Store](https://apps.apple.com/app/expo-go/id982107779)), actualizada a la versión más reciente
- El backend encendido (ver sección Backend)
- **El celular y la PC servidor deben estar conectados a la misma red WiFi**

### Ejecución
1. Instalar dependencias:
   ```
   cd movil
   npm install
   ```
2. Cambiar la IP en `src/config.js` por la IP de la PC donde corre el backend (el celular **no** reconoce `localhost`):
   ```js
   export const API_URL = 'http://192.168.1.6:3000/api';
   ```
   Para ver la IP en Windows: ejecutar `ipconfig` y buscar la "Dirección IPv4" del adaptador Wi-Fi. La consola del backend también la muestra al iniciar.
3. Iniciar Expo:
   ```
   npx expo start
   ```
4. Escanear el código QR que aparece en la terminal:
   - **Android:** desde la app Expo Go (opción "Scan QR code").
   - **iPhone:** con la app de Cámara; se abrirá en Expo Go.

### Problemas comunes
- **iPhone: "You need to be signed in to Expo Go and Expo CLI":** en iPhone hay que iniciar sesión con **la misma cuenta de Expo** en la app Expo Go y en la terminal de la PC (`npx expo login`; se verifica con `npx expo whoami`). Iniciar sesión en la página web no basta. En Android no hace falta.
- **"No hay conexión con el servidor":** revisar que el backend esté encendido, que la IP de `src/config.js` sea la correcta (puede cambiar al reconectarse al WiFi) y que el celular esté en la misma red.
- **El QR no conecta o se queda cargando:** permitir Node.js en el Firewall de Windows (redes privadas), o probar con `npx expo start --tunnel`.
- Para probar la API desde el celular, abrir en su navegador `http://IP_DEL_SERVIDOR:3000/api/categorias`: si no se ven datos, la app tampoco podrá conectarse.

### Estructura
```
movil/
├── app.json                → Configuración de Expo
└── src/
    ├── config.js           → URL de la API (IP del servidor)
    ├── api.js              → Todas las llamadas a la API (fetch)
    ├── tema.js             → Colores
    ├── app/                → Pantallas (Expo Router)
    │   ├── _layout.js      → Pestañas Categorías / Productos
    │   ├── categorias.js
    │   └── productos.js
    ├── components/         → Aviso, formulario, campos, selector de categoría
    └── hooks/              → useAviso
```
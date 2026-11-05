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
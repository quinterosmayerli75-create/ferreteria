import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import os from 'os';

import { probarConexion } from './db.js';
import categoriasRoutes from './routes/categorias.routes.js';
import productosRoutes from './routes/productos.routes.js';

dotenv.config();

const app = express();
const PUERTO = process.env.PORT || 3000;

// ===================== MIDDLEWARES =====================
app.use(cors());           // Permite que React y el celular consuman la API
app.use(express.json());   // Permite leer JSON en req.body
app.use(morgan('dev'));    // Muestra cada petición en la consola

// ===================== RUTAS =====================
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de Ferretería funcionando correctamente' });
});

app.use('/api', categoriasRoutes);
app.use('/api', productosRoutes);

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// ===================== INICIAR SERVIDOR =====================
// '0.0.0.0' hace que el servidor escuche en TODAS las interfaces de red,
// no solo en localhost. Así otras PCs y celulares del mismo WiFi pueden entrar.
app.listen(PUERTO, '0.0.0.0', async () => {
    console.log('Servidor corriendo en el puerto ' + PUERTO);
    console.log('Local:  http://localhost:' + PUERTO);

    // Mostrar las IPs de la red para compartirlas con tu compañera
    const interfaces = os.networkInterfaces();
    for (const nombreInterfaz in interfaces) {
        for (const datos of interfaces[nombreInterfaz]) {
            if (datos.family === 'IPv4' && datos.internal === false) {
                console.log('Red:    http://' + datos.address + ':' + PUERTO + '  (' + nombreInterfaz + ')');
            }
        }
    }

    await probarConexion();
});
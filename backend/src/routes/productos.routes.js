import { Router } from 'express';
import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from '../controllers/productos.controller.js';

const router = Router();

router.get('/productos', obtenerProductos);
router.get('/productos/:id', obtenerProductoPorId);
router.post('/productos', crearProducto);
router.put('/productos/:id', actualizarProducto);
router.delete('/productos/:id', eliminarProducto);

export default router;
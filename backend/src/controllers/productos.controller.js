import { pool } from '../db.js';

// Consulta base con JOIN para traer también el nombre de la categoría
const CONSULTA_PRODUCTOS = `
    SELECT
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.id_categoria,
        c.nombre AS categoria
    FROM productos p
    INNER JOIN categorias c ON p.id_categoria = c.id_categoria
`;

// Función auxiliar: valida los datos de un producto.
// Devuelve un texto con el error, o null si todo está bien.
function validarProducto(nombre, precio, stock, idCategoria) {
    if (nombre === undefined || nombre === null || String(nombre).trim() === '') {
        return 'El nombre del producto es obligatorio';
    }
    if (precio === undefined || precio === null || isNaN(Number(precio))) {
        return 'El precio es obligatorio y debe ser un número';
    }
    if (Number(precio) < 0) {
        return 'El precio no puede ser negativo';
    }
    if (stock === undefined || stock === null || !Number.isInteger(Number(stock))) {
        return 'El stock es obligatorio y debe ser un número entero';
    }
    if (Number(stock) < 0) {
        return 'El stock no puede ser negativo';
    }
    if (idCategoria === undefined || idCategoria === null || isNaN(Number(idCategoria))) {
        return 'La categoría es obligatoria';
    }
    return null;
}

// Función auxiliar: revisa si la categoría existe
async function existeCategoria(idCategoria) {
    const [filas] = await pool.query('SELECT id_categoria FROM categorias WHERE id_categoria = ?', [idCategoria]);
    return filas.length > 0;
}

// ===================== LISTAR TODOS =====================
export const obtenerProductos = async (req, res) => {
    try {
        const [filas] = await pool.query(CONSULTA_PRODUCTOS + ' ORDER BY p.id_producto');
        return res.status(200).json(filas);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
    }
};

// ===================== OBTENER UNO =====================
export const obtenerProductoPorId = async (req, res) => {
    try {
        const idProducto = req.params.id;
        const [filas] = await pool.query(CONSULTA_PRODUCTOS + ' WHERE p.id_producto = ?', [idProducto]);

        if (filas.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        return res.status(200).json(filas[0]);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
    }
};

// ===================== CREAR =====================
export const crearProducto = async (req, res) => {
    try {
        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;
        const precio = req.body.precio;
        const stock = req.body.stock;
        const idCategoria = req.body.id_categoria;

        const errorValidacion = validarProducto(nombre, precio, stock, idCategoria);
        if (errorValidacion !== null) {
            return res.status(400).json({ mensaje: errorValidacion });
        }

        const categoriaExiste = await existeCategoria(idCategoria);
        if (categoriaExiste === false) {
            return res.status(400).json({ mensaje: 'La categoría indicada no existe' });
        }

        const [resultado] = await pool.query(
            'INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria) VALUES (?, ?, ?, ?, ?)',
            [String(nombre).trim(), descripcion, Number(precio), Number(stock), Number(idCategoria)]
        );

        const [filas] = await pool.query(CONSULTA_PRODUCTOS + ' WHERE p.id_producto = ?', [resultado.insertId]);
        return res.status(201).json({ mensaje: 'Producto creado correctamente', producto: filas[0] });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al crear el producto', error: error.message });
    }
};

// ===================== ACTUALIZAR =====================
export const actualizarProducto = async (req, res) => {
    try {
        const idProducto = req.params.id;
        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;
        const precio = req.body.precio;
        const stock = req.body.stock;
        const idCategoria = req.body.id_categoria;

        const errorValidacion = validarProducto(nombre, precio, stock, idCategoria);
        if (errorValidacion !== null) {
            return res.status(400).json({ mensaje: errorValidacion });
        }

        const categoriaExiste = await existeCategoria(idCategoria);
        if (categoriaExiste === false) {
            return res.status(400).json({ mensaje: 'La categoría indicada no existe' });
        }

        const [resultado] = await pool.query(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ? WHERE id_producto = ?',
            [String(nombre).trim(), descripcion, Number(precio), Number(stock), Number(idCategoria), idProducto]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        const [filas] = await pool.query(CONSULTA_PRODUCTOS + ' WHERE p.id_producto = ?', [idProducto]);
        return res.status(200).json({ mensaje: 'Producto actualizado correctamente', producto: filas[0] });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al actualizar el producto', error: error.message });
    }
};

// ===================== ELIMINAR =====================
export const eliminarProducto = async (req, res) => {
    try {
        const idProducto = req.params.id;
        const [resultado] = await pool.query('DELETE FROM productos WHERE id_producto = ?', [idProducto]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        return res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al eliminar el producto', error: error.message });
    }
};
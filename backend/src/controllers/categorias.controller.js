import { pool } from '../db.js';

// ===================== LISTAR TODAS =====================
export const obtenerCategorias = async (req, res) => {
    try {
        const [filas] = await pool.query('SELECT * FROM categorias ORDER BY id_categoria');
        return res.status(200).json(filas);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener las categorías', error: error.message });
    }
};

// ===================== OBTENER UNA =====================
export const obtenerCategoriaPorId = async (req, res) => {
    try {
        const idCategoria = req.params.id;
        const [filas] = await pool.query('SELECT * FROM categorias WHERE id_categoria = ?', [idCategoria]);

        if (filas.length === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        return res.status(200).json(filas[0]);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener la categoría', error: error.message });
    }
};

// ===================== CREAR =====================
export const crearCategoria = async (req, res) => {
    try {
        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;

        if (nombre === undefined || nombre === null || String(nombre).trim() === '') {
            return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio' });
        }

        const [resultado] = await pool.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
            [String(nombre).trim(), descripcion]
        );

        return res.status(201).json({
            mensaje: 'Categoría creada correctamente',
            id_categoria: resultado.insertId,
            nombre: String(nombre).trim(),
            descripcion: descripcion
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ mensaje: 'Ya existe una categoría con ese nombre' });
        }
        return res.status(500).json({ mensaje: 'Error al crear la categoría', error: error.message });
    }
};

// ===================== ACTUALIZAR =====================
export const actualizarCategoria = async (req, res) => {
    try {
        const idCategoria = req.params.id;
        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;

        if (nombre === undefined || nombre === null || String(nombre).trim() === '') {
            return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio' });
        }

        const [resultado] = await pool.query(
            'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
            [String(nombre).trim(), descripcion, idCategoria]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        const [filas] = await pool.query('SELECT * FROM categorias WHERE id_categoria = ?', [idCategoria]);
        return res.status(200).json({ mensaje: 'Categoría actualizada correctamente', categoria: filas[0] });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ mensaje: 'Ya existe una categoría con ese nombre' });
        }
        return res.status(500).json({ mensaje: 'Error al actualizar la categoría', error: error.message });
    }
};

// ===================== ELIMINAR =====================
export const eliminarCategoria = async (req, res) => {
    try {
        const idCategoria = req.params.id;

        // Primero revisamos si la categoría tiene productos
        const [productos] = await pool.query(
            'SELECT COUNT(*) AS cantidad FROM productos WHERE id_categoria = ?',
            [idCategoria]
        );

        if (productos[0].cantidad > 0) {
            return res.status(409).json({
                mensaje: 'No se puede eliminar la categoría porque tiene ' + productos[0].cantidad + ' producto(s) asociado(s)'
            });
        }

        const [resultado] = await pool.query('DELETE FROM categorias WHERE id_categoria = ?', [idCategoria]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        return res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al eliminar la categoría', error: error.message });
    }
};
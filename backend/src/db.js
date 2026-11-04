import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Un "pool" es como una fila de cajeros: reutiliza conexiones
// en vez de abrir una nueva cada vez que llega una petición.
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    decimalNumbers: true
});

export async function probarConexion() {
    try {
        const conexion = await pool.getConnection();
        console.log('Conectado correctamente a MySQL');
        conexion.release();
    } catch (error) {
        console.error('Error al conectar con MySQL:', error.message);
    }
}

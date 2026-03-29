import mysql from 'mysql2/promise';

// Configura los parámetros según tu instalación local de MySQL Workbench
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
  connectionLimit: 10, // Máximo de conexiones simultáneas
    queueLimit: 0,
});

// Verificación opcional de conexión
pool.getConnection()
    .then(connection => {
        console.log('Conexión a la base de datos establecida correctamente');
        connection.release();
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err.message);
    });
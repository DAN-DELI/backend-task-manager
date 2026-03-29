import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: 'localhost',
    user: 'Manuel',   
    password: '0000',     
    database: 'proyecto_sena', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('Conexión a la base de datos establecida correctamente');
        connection.release();
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err.message);
    });

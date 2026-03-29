import mysql from 'mysql2/promise';

// Esta parte se cambio, tanto el user como el pasword y la database, por la que se use en el momento
export const pool = mysql.createPool({
    host: 'localhost',
    user: 'wilmer',    
    password: 'Colombi@1W',      
    database: 'proyecto_sena', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


pool.getConnection()
    .then(conn => {
        console.log("Conexión a MySQL exitosa (Pool)");
        conn.release();
    })
    .catch(err => {
        console.error("Error conectando a la base de datos:", err.message);
    });

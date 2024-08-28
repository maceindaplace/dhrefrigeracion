// [Código 5.6] - db.js (sin acquireTimeout)
const mysql = require('mysql2');

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: '193.203.168.5',  // IP correcta del servidor MySQL
    user: 'u373735052_certificados',   // Nombre de usuario correcto
    password: 'maceDj12',
    database: 'u373735052_certificados',  // Nombre de la base de datos correcto
    waitForConnections: true,
    connectionLimit: 10,  // Número máximo de conexiones en el pool
    queueLimit: 0         // 0 significa que no hay límite en la cola de espera
});

module.exports = pool.promise();  // Usar promesas para manejar las conexiones de manera más sencilla

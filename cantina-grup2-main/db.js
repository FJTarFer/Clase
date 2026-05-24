const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '172.19.102.22', 
    //host: 'localhost',
    port: 3306,
    user: 'cantina_user',           
    password: '1234', 
    database: 'cantina',
    charset: 'utf8mb4',
});

connection.connect(err => {
    if (err) {
        console.error('Error conectando a la DB:', err);
        return;
    }
    console.log('Conectado a la base de datos MariaDB');
});

connection.queryPromise = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = connection;
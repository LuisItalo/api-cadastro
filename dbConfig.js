const mysql = require('mysql2');

// Configuração do banco de dados
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'qwe123',
  database: 'cadastro'
};

// Criar um pool com mysql2
const pool = mysql.createPool(dbConfig);
const db = mysql.createConnection(dbConfig);

module.exports = pool.promise();  // Use .promise() para poder usar async/await

// Verificar a conexão (opcional)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão ao banco de dados estabelecida com sucesso.');
    connection.release(); // Liberar a conexão
  }
});

module.exports = db;

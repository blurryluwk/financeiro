
require('dotenv').config();

const { Pool } = require('pg');

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10), // converte para número
};

// cria um pool de conexões
const pool = new Pool(dbConfig);

// adiciona um listener para logar erros de conexão
pool.on('error', (err, client) => {
  console.error('Erro inesperado no cliente ocioso do pool:', err);
  process.exit(-1);
});

// exporta o pool e uma função de query para uso no restante do backend
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
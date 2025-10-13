import "dotenv/config";
import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Conexão com PostgreSQL estabelecida!");
    const res = await client.query("SELECT NOW()");
    console.log("🕒 Horário do banco:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Erro ao conectar ao PostgreSQL:");
    console.error(err);
  } finally {
    await client.end();
  }
}

testConnection();

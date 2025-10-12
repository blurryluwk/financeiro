require('dotenv').config(); 

const express = require('express');
const app = express();
const transactionRoutes = require('./src/routes/transactionRoutes');

// variáveis de ambiente 
require('dotenv').config(); 

app.use(express.json());

// add rotas ao Express
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
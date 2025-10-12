const express = require("express");
const cors = require("cors");
const transactionRoutes = require("./src/routes/transactionRoutes");
const userRoutes = require("./src/routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const transactionRoutes = require("./src/routes/transactionRoutes");
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

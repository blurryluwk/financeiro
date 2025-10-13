import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js"; // com .js
import transactionRoutes from "./src/routes/transactionRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Middleware de log para debug
app.use((req, res, next) => {
  console.log("Requisição recebida:", req.method, req.url);
  next();
});

// Registrando routers
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


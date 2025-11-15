import express from "express";
import cors from "cors";
import transactionRoutes from "./src/routes/transactionRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


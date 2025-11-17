import express from "express";
import cors from "cors";
import transactionRoutes from "./src/routes/transactionRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import budgetRoutes from "./src/routes/budgetRoutes.js";
import profilePictureRoutes from "./src/routes/profilePictureRoutes.js"; 
import notificationRoutes from "./src/routes/notificationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// --- Montagem das Rotas ---
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/profile-pictures", profilePictureRoutes); 
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
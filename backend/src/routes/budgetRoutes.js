import express from "express";
import BudgetController from "../controllers/budgetController.js";

const router = express.Router();

router.get("/", BudgetController.list);
router.post("/", BudgetController.createOrUpdate);
router.delete("/:id", BudgetController.delete);

export default router;

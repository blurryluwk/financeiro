import express from "express";
import TransactionController from "../controllers/transactionController.js"; 

const router = express.Router();

router.get("/", TransactionController.list);
router.get("/:id", TransactionController.get);
router.post("/", TransactionController.create);
router.put("/:id", TransactionController.update);
router.delete("/:id", TransactionController.delete);

export default router;

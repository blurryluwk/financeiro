// src/routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/transactionController");

router.get("/", TransactionController.list);
router.get("/:id", TransactionController.get);
router.post("/", TransactionController.create);
router.put("/:id", TransactionController.update);
router.delete("/:id", TransactionController.delete);

module.exports = router;

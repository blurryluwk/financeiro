const express = require("express");
const router = express.Router();
const controller = require("../controllers/budgetController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, controller.getBudgets);
router.post("/", authMiddleware, controller.saveBudget);
router.delete("/:id", authMiddleware, controller.deleteBudget);

module.exports = router;

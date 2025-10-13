import express from "express";
import CategoryController from "../controllers/categoryController.js"; // observe o .js

const router = express.Router();

router.get("/", CategoryController.list);
router.get("/:id", CategoryController.get);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.delete);

export default router;

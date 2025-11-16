import express from "express";
import UserController from "../controllers/userController.js"; // observe o .js

const router = express.Router();
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/", UserController.listUsers);  
router.put("/:id", UserController.updateUser);

export default router;
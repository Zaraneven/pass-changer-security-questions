import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.post("/api/users/register", userController.register);
router.post("/api/users/login", userController.login);
router.get("/api/users/welcome/:userId", userController.getUser);
router.put("/api/users/reset-password", userController.resetPassword);
router.put("/api/users/forget-password", userController.forgetPassword);

export default router;

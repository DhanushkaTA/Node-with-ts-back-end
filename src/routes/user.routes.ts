import express from "express";
import * as UserController from "../controllers/user.controller"

let router = express.Router();

/**
 * Get all users
 */

router.get('/all', UserController.getAllUsers)

/**
 * Create user
 */

router.post('/', UserController.creatUser)

/**
 * Create auth
 */

router.post("/auth", UserController.authUser)

export default router;
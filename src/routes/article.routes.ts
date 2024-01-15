import ArticleModel from "../models/article.model";
import {ObjectId} from "mongodb";
import {CustomResponse} from "../dtos/custom.response";
import UserModel from "../models/user.model";
import * as SchemaTypes from "../types/SchemaTypes";
import express from "express";
import * as Middleware from "../middlewares"
import * as ArticleController from "../controllers/article.controller"

let router = express.Router();

/**
 * Create article
 */
router.post("/", Middleware.verifyToken, ArticleController.createArticle)

/**
 * Get all article
 */
router.get("/all", ArticleController.getAllArticles)

/**
 * Get all articles by user
 */
router.get('/all/:username',ArticleController.getAllArticlesByUsername)

/**
 * Get my articles
 */
router.get('/my', Middleware.verifyToken, ArticleController.getMyArticles)

/**
 * Update article
 */
router.put('/update', Middleware.verifyToken, ArticleController.updateArticle)

/**
 * Delete article
 */
router.delete("/delete/:id", Middleware.verifyToken, )

export default router;
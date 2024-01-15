import ArticleModel from "../models/article.model";
import {ObjectId} from "mongodb";
import {CustomResponse} from "../dtos/custom.response";
import UserModel from "../models/user.model";
import * as SchemaTypes from "../types/SchemaTypes";
import express from "express";
import * as Middleware from "../middlewares"

let router = express.Router();

/**
 * Create article
 */
router.post("/", Middleware.verifyToken, async (req, res :any) =>{

    try {
        let request_body = req.body;
        // console.log(res.tokenData)
        let user_id = res.tokenData.user._id;

        const articleModel = new ArticleModel({
            title: request_body.title,
            description: request_body.description,
            user: new ObjectId(user_id)
        })

        await articleModel.save().then( msg =>{
            //if success
            res.status(200).send(
                new CustomResponse(
                    200,"Article successfully saved!")
            )
        }).catch(error => {
            //an occur error
            res.status(100).send(
                new CustomResponse(100, `Something went wrong : ${error}`)
            )
        })


    }catch (error) {
        res.status(100).send(
            new CustomResponse(100, "Error")
        )
    }
})

/**
 * Get all article
 */
router.get("/all",async (req, res) => {
    try {
        let query_string :any = req.query;

        let size :number = query_string.size;
        let page :number = query_string.page;

        let totalDocuments :number = await ArticleModel.countDocuments();
        let totalPages :number = Math.ceil(totalDocuments / size);

        let articles =await ArticleModel.find().limit(size).skip(size * (page - 1));

        res.status(200).send(
            new CustomResponse(
                200,
                "Articles found",
                articles,
                totalPages
            )
        )
    }catch (error) {
        res.status(100).send(
            new CustomResponse(100,`Error : ${error}`)
        )
    }

})

/**
 * Get all articles by user
 */
router.get('/all/:username',async (req, res) => {

    try {
        // console.log(req.params)
        let username=req.params.username;

        let user = await UserModel.findOne({username: username});

        if (!user){
            res.status(404).send(
                new CustomResponse(404,"User not found!")
            )
        }else {
            let query_string :any=req.query;
            let size :number = query_string.size;
            let page :number = query_string.page;

            //@ts-ignore
            let totalDocument :number=ArticleModel.countDocuments({user:user._id});
            let totalPages=Math.ceil(totalDocument / size)

            let articles =
                await ArticleModel.find({user:user._id}).limit(size).skip(size * (page - 1));

            res.status(200).send(
                new CustomResponse(
                    200,
                    "Articles found successfully",
                    articles,
                    totalPages
                )
            )
        }

    } catch (error){
        res.status(100).send(
            new CustomResponse(100,`Error : ${error}`)
        )
    }
})

/**
 * Get my articles
 */
router.get('/my', Middleware.verifyToken, async (req,res: any) =>{

    try {
        let my_id = res.tokenData.user._id;

        let query_string :any=req.query;
        let size :number = query_string.size;
        let page :number = query_string.page;

        let totalDocuments = await ArticleModel.countDocuments({user:my_id});
        let totalPages:number = Math.ceil(totalDocuments / size);

        let my_articles =
            await ArticleModel.find({user:my_id}).limit(size).skip(size * (page - 1));

        res.status(200).json(
            new CustomResponse(
                200,
                "Article found successfully!",
                my_articles,
                totalPages)
        );
    }catch (error){
        res.status(100).send(
            new CustomResponse(100,`Error : ${error}`)
        )
    }
})

/**
 * Update article
 */
router.put('/update', Middleware.verifyToken, async (req, res :any) => {
    try {
        let req_body = req.body;
        let user_id = res.tokenData.user._id;

        let article : SchemaTypes.ArticleInterface | null =
            await ArticleModel.findOne({_id:req_body.id, user:user_id});

        if (article){

            await ArticleModel.findByIdAndUpdate(
                {_id: req_body.id},
                {title:req_body.title, description: req_body.description}
            ).then(r => {
                res.status(200).send(
                    new CustomResponse(200,"Article update successfully!")
                );
            }).catch(error => {
                res.status(400).send(
                    new CustomResponse(400,`Can't find article!!! : ${error}`)
                )
            })

        }else {
            res.status(401).send(
                new CustomResponse(400,"Can't find article!!!")
            )
        }

    }catch (error){
        res.status(100).send(
            new CustomResponse(100,"Error")
        )
    }
})

/**
 * Delete article
 */
router.delete("/delete/:id", Middleware.verifyToken, async (req,res :any) => {
    try {

        let user_id = res.tokenData.user._id;
        let article_id = req.params.id;

        let article :SchemaTypes.ArticleInterface | null =
            await ArticleModel.findOne({_id:article_id , user:user_id});

        if (article) {

            await ArticleModel.deleteOne({_id:article_id}).then(r => {

                res.status(200).send(
                    new CustomResponse(200,"Article deleted successfully")
                );

            }).catch(error => {
                res.status(100).send(
                    new CustomResponse(100,`Something went wrong : ${error}`)
                )
            })

        }else {
            res.status(401).send(
                new CustomResponse(400,"Access Denied!!!")
            )
        }

    }catch (error){
        res.status(100).send(
            new CustomResponse(100,"Error")
        )
    }
})

export default router;
import mongoose, {ObjectId, Schema} from "mongoose";
import {ArticleInterface} from "../types/SchemaTypes";


const ArticleSchema = new mongoose.Schema<ArticleInterface>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    publishedDate: {type: Date, required: true, default: Date.now()},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'},
})

const ArticleModel=mongoose.model('article',ArticleSchema);

export default ArticleModel;
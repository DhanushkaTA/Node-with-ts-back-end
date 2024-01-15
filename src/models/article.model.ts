import mongoose, {ObjectId, Schema} from "mongoose";

export interface articleInterface extends mongoose.Document{
    title: string,
    description: string,
    publishedDate: Date,
    user: ObjectId
}

const ArticleSchema = new mongoose.Schema<articleInterface>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    publishedDate: {type: Date, required: true, default: Date.now()},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'},
})

const ArticleModel=mongoose.model('article',ArticleSchema);

export default ArticleModel;
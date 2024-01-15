import mongoose, {ObjectId} from "mongoose";

export interface UserInterface extends mongoose.Document{
    username: string,
    fName:string,
    lName:string,
    email:string,
    password:string
}

export interface ArticleInterface extends mongoose.Document{
    title: string,
    description: string,
    publishedDate: Date,
    user: ObjectId
}
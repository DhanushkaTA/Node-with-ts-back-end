import mongoose from "mongoose";
import {UserInterface} from "../types/SchemaTypes";

const userSchema = new mongoose.Schema<UserInterface>({
    username:{type:String, required:true},
    fName:{type:String, required:true},
    lName:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true}
})

const UserModel= mongoose.model("user",userSchema);
export default UserModel;
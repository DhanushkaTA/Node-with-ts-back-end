import mongoose from "mongoose";

export interface userInterface extends mongoose.Document{
    username: string,
    fName:string,
    lName:string,
    email:string,
    password:string
}

const userSchema = new mongoose.Schema<userInterface>({
    username:{type:String, required:true},
    fName:{type:String, required:true},
    lName:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true}
})

const UserModel= mongoose.model("user",userSchema);
export default UserModel;
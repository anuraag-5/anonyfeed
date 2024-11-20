import mongoose , { Schema } from "mongoose"

export interface Message{
    _id? : mongoose.Schema.Types.ObjectId ,
    content : string ,
    createdAt : Date
}
const MessageSchema = new Schema<Message>({
    content : {
        type : String ,
        required : true
    } ,
    createdAt : {
        type : Date ,
        default : Date.now
    }
})

export interface User{
    username  : string ,
    email : string ,
    password : string ,
    verifyOtp? : string ,
    verifyOtpExpiry? : Date ,
    isVerified : boolean ,
    isAcceptingMessage : boolean ,
    messages : Message[]
}

const UserSchema = new Schema<User>({
    username : {
        type : String ,
        unique : true ,
        required : [true , "Username is required" ]
    } ,
    email : {
        type : String ,
        unique : true ,
        required : [true , "Username is required" ] ,
        match : [/.+\@.+\..+/,"Please use a valid email address"]
    } ,
    password : {
        type : String ,
        required : [true , "Password is required" ]
    } ,
    verifyOtp :{
        type : String,
        // required : [ true, "Verify Code is required"]
        default : null
    } ,
    verifyOtpExpiry : {
        type : Date,
        // required : [ true, "Verify Code Expiry is required"]
        default : null
    } ,
    isVerified:{
        type : Boolean ,
        default : false
    },
    isAcceptingMessage :{
        type : Boolean ,
        default : true
    },
    messages : [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel
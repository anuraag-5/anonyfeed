import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request : Request){
    await  dbConnect()
    try {
        const { username , content } = await request.json()
        const user = await UserModel.findOne({
            username
        })

        if(!user){
            return Response.json({
                success : false ,
                message : "User not found"
            },{
                status : 404
            })
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success : false ,
                message : "User is not accepting messages"
            },{
                status : 404
            })
        }

        const newMessage : Message  = {
            content ,
            createdAt : new Date()
        }

        user.messages.push(newMessage)
        await user.save()
        return Response.json({
            success : true ,
            message : "Message sent successfully"
        },{
            status : 201
        })

    } catch(error){
        console.log("An unexpected error occured during sending message",error)
        return Response.json({
            success : false ,
            message : "An unexpected error occured during sending message"
        },{
            status : 500
        })
    }
}
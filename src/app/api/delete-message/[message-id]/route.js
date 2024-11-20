import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { error } from "console";

// @ts-ignore
export async function DELETE(request , { params }){
    const messageId = params.messageId
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session || !session.user){
        console.log("Error in deleting messsage" , error)
        return Response.json({
            success : false ,
            message : "Not authenticated"
        } , {
            status : 401
        })
    }

    try {
        const updatedUser = await UserModel.updateOne({
            _id : user._id
        },{
            $pull : { messages : {_id : messageId}}
        })

        if(updatedUser.modifiedCount == 0){
            return Response.json({
                success : false ,
                message : "Message not found or already deleted"
            },{
                status : 404
            })
        }

        return Response.json({
            success : true ,
            message : "Message deleted"
        },{
            status : 200
        })
    } catch (error) {
        return Response.json({
            success : false ,
            message : "Error deleting message"
        },{
            status : 500
        })
    }

}
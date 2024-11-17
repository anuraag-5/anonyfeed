import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req : Request){
    await dbConnect()
    try {
        const { username , otp } = await req.json();
        const decodeUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username : decodeUsername ,
            verifyOtp : otp ,
            verifyOtpExpiry : {
                $gt : Date.now()
            }
        })

        if(!user){
            return Response.json({
                success : false ,
                message : "User not found or otp expired"
            },{
                status : 400
            })
        }
        user.verifyOtp = undefined
        user.verifyOtpExpiry = undefined
        user.isVerified = true

        await user.save()
        return Response.json({
            success : true ,
            message : "Correct otp"
        },{
            status : 200
        })

    } catch (error) {
        console.error("Error verifying username",error)
        return Response.json({
            success : false ,
            message : "Error verifying username"
        },{
            status : 500
        }) 
    }
}
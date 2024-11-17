import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/Zodschemas/signUpSchema"

const usernameSchema = z.object({
    username : usernameValidation
})

export async function GET(req : Request){
    await dbConnect();
    //localhost:3000/api/check-uiusername?username=anurag
    try {
        const { searchParams } = new URL(req.url)
        const queryParam = {
            username : searchParams.get("username")
        }

        //validate with zod
        const result = usernameSchema.safeParse(queryParam)
        console.log(result) // todo : remove
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json({
                success : false ,
                message : usernameErrors?.length > 0 ? usernameErrors.join(",") : "invalid query params"
            },{
                status : 400
            })
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username ,
            isVerified : true
        })

        if(existingVerifiedUser){
            return Response.json({
                success : false ,
                message : "Username already taken"
            },{
                status : 400
            })
        }

        return Response.json({
            success : true ,
            message : "Username is available"
        },{
            status : 201
        })


    } catch (error) {
        console.error("Error checking username",error)
        return Response.json({
            success : false ,
            message : "Error checking username"
        },{
            status : 500
        }) 
    }
}
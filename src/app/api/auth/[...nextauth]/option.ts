import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import bcrypyt from "bcryptjs"
import UserModel from "@/model/User";

export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id : "credentials",
            name : "Credentials",
            credentials : {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },

            } , 
            async authorize(credentials : any): Promise<any>{
                // Add logic here to look up the user from the credentials supplied
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or : [
                            {email : credentials.email},
                            {username : credentials.email}
                        ]
                    })

                    if(!user){
                        throw new Error("User not found")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account before logging in")
                    }

                    const isPassCorrect = await bcrypyt.compare(credentials.password,user.password)

                    if(isPassCorrect){
                        return user
                    }else{
                        throw new Error("Incorrect Password")
                    }
                } catch (error: unknown) {
                    console.error("Error during authorization:", error);  // Log the error for debugging
                    throw new Error("Something went wrong");
                }

            }

        })
    ] , 
    callbacks : {
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        } , 
        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        }
    } ,
    pages: {
        signIn: '/signin'
    } , 
    session : {
        strategy : "jwt"
    } ,
    secret : process.env.NEXTAUTH_SECRET
}
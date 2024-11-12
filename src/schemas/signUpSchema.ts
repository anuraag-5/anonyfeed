import  { z } from "zod"

const usernameValidation = z.string()
    .min(2,{ message: "Username should be at least 2 characters" })
    .max(20,{ message: "Username cannot exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/,{ message: "Username cannot contain special characters" })


export const signUpSchema = {
    username : usernameValidation ,
    email : z.string().email({
        message : "Invalid email address"
    }) ,
    password : z.string().min(6,{
        message : "Must be at least 6 characters long"
    })
}
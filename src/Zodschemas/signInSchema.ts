import { z } from "zod"

export const signinValidation = {
    email : z.string() ,
    password : z.string()
}
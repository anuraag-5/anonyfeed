import { z } from "zod"

export const signinValidation = z.object({
    email : z.string() ,
    password : z.string()
})
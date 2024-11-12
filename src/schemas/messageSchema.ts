import { z } from "zod"

export const messageValidation = {
    content : z.string()
    .min(10 , {
        message : "Min 10 characters"
    })
    .max(300 , {
        message : "Max 300 characters"
    })
}
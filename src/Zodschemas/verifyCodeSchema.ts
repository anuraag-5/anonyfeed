import { z } from "zod"

export const codeValidation = {
    code : z.string().length(6,{
        message : "Code should be of 6 characters"
    })
}
import { z } from "zod"

export const acceptMessagesValidation = z.object({
    acceptMessages : z.boolean()
})
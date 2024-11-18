"use client"

import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from "@/types/ApiResponse"

export default function InputOTPControlled() {
  const router = useRouter()
  const params = useParams()
  const username = params.username
  const  { toast } = useToast()

  const [value, setValue] = React.useState("")
  const onSubmit = async () => {
    try {
        const response = await axios.post("/api/verify-code",{
            username ,
            value
        })

        if(response.data.success){
            toast({
                title : "Success" ,
                description : response.data.message
            })
            router.push("/dashboard")
            return
        }
        else {
            toast({
                title : "Failed to verify otp" ,
                description : response.data.message ,
                variant : "destructive"
            })
            router.push("/signin")
            return
        }
    } catch (error) {
        console.error("error in verifying of user");
        const axiosError = error as AxiosError<ApiResponse>;
        let errrorMesssage = axiosError.response?.data.message;
  
        toast({
          title: "Verification failed",
          description: errrorMesssage,
          variant: "destructive",
        });
      }
  }
  return (
    <div className="space-y-2 min-w-full flex flex-col justify-center min-h-screen items-center">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {value === "" ? (
          <>Enter your one-time password.</>
        ) : (
          <>You entered: {value}</>
        )}
      </div>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  )
}

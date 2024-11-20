'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect ,useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios , { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { signinValidation } from "@/Zodschemas/signInSchema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

const page = () => {
  const [ isSubmitting , setIsSubmitting ] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  
  const form = useForm<z.infer<typeof signinValidation>>({
    resolver : zodResolver(signinValidation) ,
    defaultValues : {
      email : "",
      password : ""
    }
  })

  const onSubmit = async (data : z.infer<typeof signinValidation>) => {
    const result = await signIn("credentials",{
      redirect : false ,
      email : data.email ,
      password : data.password
    })
    if(result?.error){
      toast({
        title : "Failed to sign in" ,
        description : "Incorrect username or password" ,
        variant : "destructive"
      })
    }

    if(result?.url){
      router.replace("/dashboard")
    }

  }

  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-x-8 bg-white rounded-lg shadow-md">
        <div className=" text-center">
          <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Sign in
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" mb-4 font-bold">email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" mb-4 font-bold">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className=" mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        {/* <div className=" w-full flex justify-center items-center flex-col">
          <p>
            Already a member?{" "}
          </p>
            <Link
              href={"/signin"}
              className=" text-blue-600 hover:text-blue-800"
            >
              Signin
            </Link>
          
        </div> */}
      </div>
    </div>
  );
}

export default page
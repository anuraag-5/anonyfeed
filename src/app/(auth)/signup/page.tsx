"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/Zodschemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setIsChecking(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-unique-username?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "Error checking username"
          );
        } finally {
          setIsChecking(false);
        }
      }
    };
    checkUsernameUniqueness();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log("Submitting data:", data);
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("error in signup of user");
      const axiosError = error as AxiosError<ApiResponse>;
      let errrorMesssage = axiosError.response?.data.message;

      toast({
        title: "Signup failed",
        description: errrorMesssage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-x-8 bg-white rounded-lg shadow-md">
        <div className=" text-center">
          <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join
          </h1>
          <p className=" mb-4 font-extrabold">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" mb-4 font-bold">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isChecking && <Loader2 className="animate-spin" />}
                  {usernameMessage && (
                    <p
                      className={
                        usernameMessage.includes("available")
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

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
        <div className=" w-full flex justify-center items-center flex-col">
          <p>
            Already a member?{" "}
          </p>
            <Link
              href={"/signin"}
              className=" text-blue-600 hover:text-blue-800"
            >
              Signin
            </Link>
          
        </div>
      </div>
    </div>
  );
};

export default page;

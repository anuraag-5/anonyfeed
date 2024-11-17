import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";
// import bcryptjs from "bcryptjs";
import UserModel from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";

dbConnect();
interface emailVerificationProps{
  email : string ,
  // username : string ,
  otp : string
}
export async function sendVerificationEmail({
  email ,
  // username ,
  otp
} : emailVerificationProps ): Promise<ApiResponse> {
  try {
    const user = await UserModel.findOneAndUpdate({
      email
    },{
      verifyOtp : otp ,
      verifyOtpExpiry : Date.now() + 360000
    })

    if(!user){
      return {
        success : false ,
        message : "User not found to send verification email"
      }
    }

    

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d50cb78f602022",
        pass: "f87fed7b984d74",
      },
    });

    await transporter.sendMail({
      from: "anuragbhoite229@gmail.com",
      to: email,
      subject: "Anonyfeed | Verify email code",
      html: ` Your otp to verify email is : ${otp} `,
    });
    return {
      success : true ,
      message : "Verification email sent successfully"
    }
  } catch (emailError) {
    console.log("Error sending verification email",emailError)

    return {
      success : false ,
      message : "Failed to send verification email"
    }
  }
}

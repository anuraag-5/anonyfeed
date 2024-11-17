import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, Password } = await request.json();

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const verifyOtpExpiry = Date.now() + 3600000; // OTP expires in 1 hour

    const existingEmailUser = await UserModel.findOne({ email });
    if (existingEmailUser) {
      if (existingEmailUser.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      } else {
        const hashedPass = await bcryptjs.hash(Password, 10);
        existingEmailUser.password = hashedPass;
        existingEmailUser.verifyOtp = otp; // Set OTP
        await existingEmailUser.save();
      }
    } else {
      const hashedPass = await bcryptjs.hash(Password, 10);

      const user = new UserModel({
        username,
        email,
        password: hashedPass,
        verifyOtp: otp, // Set OTP for new user
        verifyOtpExpiry : Date.now() + 3600000, // Set OTP expiry for new user
        messages: [],
      });

      await user.save();
    }

    const response = await sendVerificationEmail({
      email , otp
    });

    if (!response.success) {
      return Response.json(
        { success: false, message: "Failed to send email" },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "Signup successful. Please verify your email" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering user", error);

    return Response.json(
      { success: false, message: "Error in signing up" },
      { status: 500 }
    );
  }
}

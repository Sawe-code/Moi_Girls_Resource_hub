import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import { handleApiError } from "@/lib/error";
import crypto from "crypto";
import resend from "@/lib/resend";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email } = (await req.json()) as {
      email?: string;
    };
    if (!email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        {
          success: true, // this is for purpose of security.
          error:
            "If an account with that email exists, a password reset link has been sent.",
        },
        { status: 200 },
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex"); // used instead of using Math.random()
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    const { error } = await resend.emails.send({ // error destructuring 
      from: "Moi Girls Resource Hub <onboarding@resend.dev>",
      to: normalizedEmail,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2 style="margin-bottom: 12px;">Password Reset Request</h2>
          <p>You requested to reset your password for Moi Girls Resource Hub.</p>
          <p>Click the link below to set a new password:</p>
          <p>
            <a href="${resetLink}" style="color: #2563eb; word-break: break-all;">
              ${resetLink}
            </a>
          </p>
          <p>This link will expire in 15 minutes.</p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
        `,
    });

    if (error) {
      console.error("Error sending reset email:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send reset email.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 },
    );
  } catch (error) {
    const { status, message } = handleApiError(error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status },
    );
  }
}

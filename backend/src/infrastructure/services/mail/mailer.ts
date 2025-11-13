// import nodemailer from 'nodemailer';

// import dotenv from 'dotenv';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendOtpMail = async (to: string, otp: string): Promise<void> => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject: 'Your OTP Code for Tripsera',
//     text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
//   };

//   try {
//      await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.log('s');

//     console.error(` Failed to send OTP email: ${(error as Error).message}`);
//     throw new Error('Failed to send OTP email');
//   }
// };
import { transporter } from "./transporter";

export const sendOtpMail = async (to: string, otp: string): Promise<void> => {
  const htmlContent = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f6f9fc; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: linear-gradient(90deg, #1e88e5, #42a5f5); color: white; padding: 16px 24px;">
        <h2 style="margin: 0;">Tripsera Verification</h2>
      </div>
      <div style="padding: 24px; color: #333;">
        <p style="font-size: 16px;">Hello 👋,</p>
        <p style="font-size: 16px;">
          Thank you for choosing <strong>Tripsera</strong>!  
          To continue, please use the OTP below to verify your email:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #1e88e5; background: #e3f2fd; padding: 12px 20px; border-radius: 8px;">
            ${otp}
          </div>
        </div>
        <p style="font-size: 15px;">This OTP is valid for <strong>5 minutes</strong>. Please don’t share it with anyone.</p>
        <p style="font-size: 14px; color: #777;">If you didn’t request this, you can safely ignore this email.</p>
      </div>
      <div style="background-color: #f1f1f1; text-align: center; padding: 12px; font-size: 12px; color: #555;">
        © ${new Date().getFullYear()} Tripsera. All rights reserved.
      </div>
    </div>
  </div>
  `;

  const mailOptions = {
    from: `"Tripsera" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code for Tripsera",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(` OTP email sent to ${to}`);
  } catch (error) {
    console.error(` Failed to send OTP email: ${(error as Error).message}`);
    throw new Error("Failed to send OTP email");
  }
};

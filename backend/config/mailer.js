import nodemailer from "nodemailer";
import process from "process";


const requiredEnvKeys = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "MAIL_FROM",
];


const validateMailerEnv = () => {
  const missingKeys = requiredEnvKeys.filter((key) => !process.env[key]);


  if (missingKeys.length > 0) {
    throw new Error(
      `Missing mail configuration: ${missingKeys.join(", ")}. Please set these in backend .env`,
    );
  }
};


const getTransporter = () => {
  validateMailerEnv();


  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};


export const sendVerificationEmail = async ({
  toEmail,
  subject,
  html,
}) => {
  const transporter = getTransporter();


  console.log("📧 Sending email to:", toEmail);
  console.log("📧 Subject:", subject);


  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: toEmail,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Mail send error:", err.message);
    console.error("❌ Full error:", err);
    throw err;
  }
};



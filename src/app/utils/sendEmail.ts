/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/AppError";
const transporter = nodemailer.createTransport({
  secure: true,
  auth: {
    user: envVars.SMTP.SMTP_USER,
    pass: envVars.SMTP.SMTP_PASS,
  },

  port: Number(envVars.SMTP.SMTP_PORT),
  host: envVars.SMTP.SMTP_HOST,
});

interface sendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  tempalteData?: Record<string, any>;
  attachments?: {
    fileName: string;
    content: Buffer | string;
    contentType: string;
  }[];
}
export const sendEmail = async ({
  to,
  subject,
  templateName,
  tempalteData,
  attachments,
}: sendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, tempalteData);
    const info = await transporter.sendMail({
      from: envVars.SMTP.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.fileName,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
  } catch (error: any) {
    console.log("Email Sending Error", error.message);
    throw new AppError(401, "Email error");
  }
};

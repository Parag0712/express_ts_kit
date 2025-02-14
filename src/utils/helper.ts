import bcrypt from "bcrypt";
import ejs from "ejs";
import jwt, { SignOptions } from "jsonwebtoken";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { z, ZodError } from "zod";
import { __dirname } from "../index.js";
import path from "path";
import crypto from "crypto";
import { JWT_SECRET } from "../constants/constants.js";

// CONSTANTS
const SALT_ROUNDS = 10;
const EXPIRES_IN = "1d";

type OtpValidationResult = {
  isValid: boolean;
  errorType?: "expired" | "invalid";
};

// FUNCTION
export const formatError = (error: ZodError): any => {
  let errors: any = {};
  error.errors?.map((issue) => {
    errors[issue.path[0]] = issue.message;
  });
  return errors;
};

export const generateRandomNum = () => {
  return uuidv4();
};

// Function to generate an OTP
export const generateOTP = (length: number): string => {
  let otp = "";
  const characters = "0123456789";
  for (let i = 0; i < length; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return otp;
};

export const renderEmailEjs = async (fileName: string, payload: any) => {
  const html = await ejs.renderFile(
    __dirname + `/views/emails/${fileName}.ejs`,
    payload
  );
  return html;
};

export const renderTemplate = async (
  templateName: string,
  user: object
): Promise<string> => {
  try {
    // Validate inputs
    if (!templateName || typeof templateName !== "string") {
      throw new Error("Invalid template name provided.");
    }
    if (!user || typeof user !== "object") {
      throw new Error("Invalid user data provided.");
    }

    console.log("Rendering template:", templateName);
    console.log("Template data:", JSON.stringify(user));

    // Construct the file path
    const filePath = path.join(
      __dirname,
      "views/emails",
      `${templateName}.ejs`
    );

    // Render the template
    return await ejs.renderFile(filePath, user, { async: true });
  } catch (error) {
    const errorMessage = (error as Error).message;

    // Log error with context
    console.error(
      `Error rendering EJS template '${templateName}':`,
      errorMessage
    );

    // Graceful fallback
    const fallbackMessage = `<p>Dear User, we encountered an issue processing your request. Please try again later.</p>`;
    return fallbackMessage; // Or consider throwing a specific error if needed
  }
};

export const checkDateHourDifference = (date: Date | string): number => {
  const now = moment();
  const tokenSentAt = moment(date);
  const difference = moment.duration(now.diff(tokenSentAt));
  const hoursDiff = difference.asHours();
  return hoursDiff;
};

export const isOtpValid = (
  providedOtp: string,
  storedOtp: string | null,
  expiresAt: Date | null
): OtpValidationResult => {
  if (!storedOtp || !expiresAt) {
    return { isValid: false, errorType: "invalid" }; // If no OTP or expiration, consider it invalid
  }
  const now = new Date();
  const isOtpExpired = now > expiresAt;
  const isOtpCorrect = Number(providedOtp) === Number(storedOtp);

  if (!isOtpCorrect) {
    return { isValid: false, errorType: "invalid" }; // Invalid OTP
  }
  if (isOtpExpired) {
    return { isValid: false, errorType: "expired" }; // Expired OTP
  }
  return { isValid: true }; // OTP is valid
};

// Function to hash a password
export const hashPassword = async (password: string) => {
  const saltRounds = SALT_ROUNDS;
  return await bcrypt.hash(password, saltRounds);
};

// Function to compare a password with a hashed password
export const comparePasswords = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

// Function to generate a JWT
export const generateToken = (payload: string | object | Buffer): string => {
  return jwt.sign(
    payload,
    JWT_SECRET as jwt.Secret,
    { expiresIn: EXPIRES_IN } as SignOptions
  );
};

// Function to verify a JWT
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET as jwt.Secret);
};

// FUnction to Generate a random Client Password
export const generateRandomPassword = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateUniqueId = (): string => {
  const allowedChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const idLength = 50;
  let uniqueId = "";

  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    uniqueId += allowedChars[randomIndex];
  }

  return uniqueId;
};

export const truncateToDecimals = (number: number, decimals: number) => {
  const decimalSeparator = ".";
  const numStr = number.toString();
  const parts = numStr.split(decimalSeparator);

  // If no decimal part or already shorter, return as is
  if (parts.length === 1 || parts[1].length <= decimals) {
    return number;
  }

  // Take only the digits we want by substring
  return Number(parts[0] + decimalSeparator + parts[1].substring(0, decimals));
};

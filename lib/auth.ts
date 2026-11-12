import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import User from "@/models/user";

type AuthUser = {
  id: string;
  role: string;
};

const getEnvVar = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not defined`);
  }

  return value;
};

const JWT_SECRET = getEnvVar("JWT_SECRET");

export const getAuthUser = (req: NextRequest): AuthUser => {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
  return decoded;
};

/**
 * Resolve the role from MongoDB for authorization checks. The role claim in an
 * existing session token can be stale after an account's role is changed.
 */
export const getCurrentAuthUser = async (
  req: NextRequest,
): Promise<AuthUser> => {
  const tokenUser = getAuthUser(req);
  const user = await User.findById(tokenUser.id).select("role").lean();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return { id: tokenUser.id, role: user.role };
};

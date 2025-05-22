// src/lib/auth.server.ts
import { createCookie } from "react-router";
import jwt from "jsonwebtoken";

export type UserPayload = {
  sub: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
};

export const sessionCookie = createCookie("session", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7, // 7 days
});

export async function getSessionCookie(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookie = await sessionCookie.parse(cookieHeader);
  if (!cookie) return null;

  return cookie as string;
}

export async function getUserFromRequest(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookie = await sessionCookie.parse(cookieHeader);
  if (!cookie) return null;

  return jwt.decode(cookie) as UserPayload;
}

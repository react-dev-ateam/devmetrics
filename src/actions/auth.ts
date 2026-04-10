"use server";

import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key"
);

export async function login(email: string) {
  try {
    const token = await new SignJWT({ email, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      path: "/",
      maxAge: 86400,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return { success: true };
  } catch (error) {
    console.error("Login verification failed:", error);
    return { success: false, error: "Authentication failed" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return { success: true };
}

export async function getUserEmail() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    
    // We need to dynamically import jwtVerify or add it to imports
    const { jwtVerify } = await import("jose");
    const { payload } = await jwtVerify(token, secret);
    return payload.email as string;
  } catch (error) {
    return null;
  }
}

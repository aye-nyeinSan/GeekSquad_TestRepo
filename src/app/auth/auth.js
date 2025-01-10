"use server";
import { NextResponse } from "next/server"; // Use NextResponse from "next/server"
import db from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createSession } from "./session.js";

import { signUpFormSchema, loginFormSchema } from "./errordefinition.js";

// signUp
export async function signUp(req) {
  try {
    // 1. Parse request body
    const body = await req.json();

    // 2. Validate form field data
    const validatedData = signUpFormSchema.safeParse(body);

    // Validation failed, return early
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.flatten().fieldErrors },
        { status: 400 } // Set status in NextResponse options
      );
    }

    // 3. Check if email already exists
    const [rows] = await db("SELECT * FROM User WHERE UserEmail = ?", [
      validatedData.data.email,
    ]);

    // If email exists, return early
    if (rows && rows.length > 0) {
      return NextResponse.json(
        { error: "Email already exists! Use another email" },
        { status: 400 }
      );
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(validatedData.data.password, 10);

    // 5. Save user to db and get insertId
    const result = await db("INSERT INTO User(UserEmail, UserPassword) VALUES(?,?)", [
      validatedData.data.email,
      hashedPassword,
    ]);
    const userId = result.insertId;

    // 6. Create session for user
    const token = await createSession(userId);

    // 7. Send success response
    return NextResponse.json(
      {
        message: "User created successfully",
        data: { userId, token },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during sign up:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

//login
export async function login(req, res) {
  //1. validate form field data
    const body = await req.json();
  const validatedData = loginFormSchema.safeParse(body);

    console.log("Validated data", validatedData);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: validatedData.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  //2. query user from db => if user not found , return early
  const rows = await db("SELECT * FROM User WHERE UserEmail = ?", [
    validatedData.data.email,
  ]);
  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  //3. Compare password with hashed password in db=> if password does not match, return early
  const user = rows[0];
  console.log("User", user);
  
  const passwordMatched = await bcrypt.compare(
    validatedData.data.password,
    user.UserPassword
  );
  if (!passwordMatched) {
    return NextResponse.json(
      { error: "Password uncorrect!" },
      { status: 400 }
    );
  }
  //4. successful create session for user
  const token = await createSession(user);
 
  // 5. Redirect to dashboard with a token in cookies
 const response = NextResponse.json(
   { success: true, message: "Login successful" },
   { status: 200 }
 );

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 86400, // 1 day
    sameSite: "lax",
  });



  return response;
}

//logout
export async function logout(req, res) {
  //1. destroy session
  //2. redirect user to login page
}

//forgot passsword
export async function forgotPassword(req, res) {}

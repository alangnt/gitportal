import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("opensourcefinder");

    const collection = db.collection("users");

    const { name, email, image }: { name: string; email: string; image: string } = await req.json();

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const newUser = {
      name,
      email,
      image,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newUser);

    return NextResponse.json(
      { message: "User created successfully", documentId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting user:", error);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}

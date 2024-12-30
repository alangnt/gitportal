import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "../../../lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("opensourcefinder");

    const collection = db.collection("projects");
    const documents = await collection.find({}).toArray();

    return NextResponse.json({ message: "Success", data: documents });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

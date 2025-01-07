import { NextRequest, NextResponse } from "next/server";
import { fetchRepoDetails } from "@/utils/github";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Owner and repository are required" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchRepoDetails(owner, repo);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching repository details:", error);
    return NextResponse.json(
      { error: "Failed to fetch repository details" },
      { status: 500 }
    );
  }
}

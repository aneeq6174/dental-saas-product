import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const clinicId = searchParams.get("clinicId");

  const filter = clinicId ? { clinicId } : {};
  const submissions = await Submission.find(filter).sort({ createdAt: -1 }).limit(200);

  return NextResponse.json({ submissions });
}
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Clinic from "@/models/Clinic";

export async function GET() {
  await connectDB();
  const clinics = await Clinic.find().sort({ createdAt: -1 });
  return NextResponse.json({ clinics });
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const clinic = await Clinic.create(body);
    return NextResponse.json({ success: true, clinic });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
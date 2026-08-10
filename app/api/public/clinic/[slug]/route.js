import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Clinic from "@/models/Clinic";

export async function GET(req, { params }) {
  await connectDB();
  const { slug } = await params;

  const clinic = await Clinic.findOne({ slug }).select("name branding services slug");
  if (!clinic) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ clinic });
}
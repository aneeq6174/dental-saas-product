import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Clinic from "@/models/Clinic";
import { makeClinicSessionValue } from "@/lib/clinicAuth";

export async function POST(req) {
  await connectDB();
  const { slug, password } = await req.json();

  const clinic = await Clinic.findOne({ slug });
  if (!clinic || clinic.dashboardPassword !== password) {
    return NextResponse.json({ error: "Invalid clinic or password" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true, clinicId: clinic._id });
  res.cookies.set("clinic_session", makeClinicSessionValue(clinic._id.toString()), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
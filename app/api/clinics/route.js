import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Clinic from "@/models/Clinic";
import { requireAdminSecret } from "@/lib/auth";
// POST /api/clinics — create a new clinic (onboarding)
export async function POST(req) {
  const authError = requireAdminSecret(req);
if (authError) return authError;
  try {
    await connectDB();
    const body = await req.json();

    const clinic = await Clinic.create(body);
    return NextResponse.json({ success: true, clinic });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// GET /api/clinics?slug=xyz  OR  ?id=xyz
export async function GET(req) {
  const authError = requireAdminSecret(req);
if (authError) return authError;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");

  const clinic = slug
    ? await Clinic.findOne({ slug })
    : id
    ? await Clinic.findById(id)
    : null;

  if (!clinic) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ clinic });
}

// PATCH /api/clinics?id=xyz — update config (settings page)
export async function PATCH(req) {
  const authError = requireAdminSecret(req);
if (authError) return authError;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();

  const clinic = await Clinic.findByIdAndUpdate(id, body, { new: true });
  if (!clinic) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ clinic });
}

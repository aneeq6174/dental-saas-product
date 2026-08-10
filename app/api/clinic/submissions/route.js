import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { verifyClinicSession } from "@/lib/clinicAuth";

function getClinicIdFromCookie(req) {
  const cookie = req.cookies.get("clinic_session")?.value;
  return verifyClinicSession(cookie);
}

export async function GET(req) {
  const clinicId = getClinicIdFromCookie(req);
  if (!clinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const submissions = await Submission.find({ clinicId }).sort({ createdAt: -1 }).limit(200);
  return NextResponse.json({ submissions });
}

export async function PATCH(req) {
  const clinicId = getClinicIdFromCookie(req);
  if (!clinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { submissionId, status } = await req.json();

  const allowed = ["completed", "no_show", "booked"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const submission = await Submission.findOne({ _id: submissionId, clinicId });
  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });

  submission.status = status;
  if (status === "completed") {
    submission.completedAt = new Date();
    submission.followUpSent = true;
  }
  await submission.save();

  return NextResponse.json({ success: true, submission });
}
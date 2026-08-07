import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Clinic from "@/models/Clinic";
import Submission from "@/models/Submission";
import { checkEscalation, generateAiReply } from "@/lib/ai";
import { sendPatientReply, sendClinicNotification } from "@/lib/email";
import { requireAdminSecret } from "@/lib/auth";
// POST /api/submissions?clinicSlug=xyz
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { clinicSlug, patientName, email, phone, query, formData } = body;

    if (!clinicSlug || !patientName || !email) {
      return NextResponse.json(
        { error: "clinicSlug, patientName, and email are required" },
        { status: 400 }
      );
    }

    const clinic = await Clinic.findOne({ slug: clinicSlug });
    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    const submission = await Submission.create({
      clinicId: clinic._id,
      patientName,
      email,
      phone,
      query,
      formData,
    });

    // Escalation check
    const { urgent } = await checkEscalation(clinic, submission);
    submission.urgent = urgent;

    // Generate AI reply grounded in clinic config
    const aiReplyText = await generateAiReply(clinic, submission);
    submission.aiReply = aiReplyText;
    submission.status = "ai_replied";
    submission.repliedAt = new Date();
    await submission.save();

    // Send email + notify clinic (don't let email failures block the response)
    try {
      await sendPatientReply({ to: email, patientName, clinic, aiReplyText });
      await sendClinicNotification({ clinic, submission });
    } catch (notifyErr) {
      console.error("Notification error:", notifyErr);
    }

    return NextResponse.json({ success: true, submissionId: submission._id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/submissions?clinicId=xyz  (used by dashboard)
export async function GET(req) {
  const authError = requireAdminSecret(req);
if (authError) return authError;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const clinicId = searchParams.get("clinicId");

  const filter = clinicId ? { clinicId } : {};
  const submissions = await Submission.find(filter).sort({ createdAt: -1 }).limit(200);

  return NextResponse.json({ submissions });
}

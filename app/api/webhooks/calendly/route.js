import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const event = body.event;
    const payload = body.payload;

    if (!payload?.email) {
      return NextResponse.json({ received: true, note: "no email in payload" });
    }

    const patientEmail = payload.email;
    const appointmentTime = payload.scheduled_event?.start_time
      ? new Date(payload.scheduled_event.start_time)
      : null;

    const submission = await Submission.findOne({ email: patientEmail }).sort({ createdAt: -1 });

    if (!submission) {
      return NextResponse.json({ received: true, note: "no matching submission found" });
    }

    if (event === "invitee.created") {
      submission.status = "booked";
      submission.appointmentTime = appointmentTime;
      submission.bookedAt = new Date();
    } else if (event === "invitee.canceled") {
      submission.status = "new";
    }

    await submission.save();

    return NextResponse.json({ received: true, submissionId: submission._id });
  } catch (err) {
    console.error("Calendly webhook error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
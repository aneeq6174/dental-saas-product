import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import Clinic from "@/models/Clinic";
import { sendFollowUpNoShow } from "@/lib/email";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const now = new Date();
  const candidates = await Submission.find({
    status: "booked",
    appointmentTime: { $lt: now },
    followUpSent: { $ne: true },
  });

  let sentCount = 0;

  for (const submission of candidates) {
    const clinic = await Clinic.findById(submission.clinicId);
    if (!clinic?.addOns?.followUpNoShow?.enabled) continue;

    const delayHours = clinic.addOns.followUpNoShow.delayHours || 24;
    const dueTime = new Date(submission.appointmentTime.getTime() + delayHours * 60 * 60 * 1000);
    if (now < dueTime) continue;

    try {
      await sendFollowUpNoShow({
        to: submission.email,
        patientName: submission.patientName,
        clinic,
      });
      submission.status = "no_show";
      submission.followUpSent = true;
      await submission.save();
      sentCount++;
    } catch (err) {
      console.error(`Failed to send follow-up for submission ${submission._id}:`, err);
    }
  }

  return NextResponse.json({ checked: candidates.length, sent: sentCount });
}
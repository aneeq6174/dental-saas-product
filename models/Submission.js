import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true },

    patientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    query: String,
    formData: { type: mongoose.Schema.Types.Mixed, default: {} },

    status: {
      type: String,
      enum: ["new", "ai_replied", "booked", "no_show", "completed"],
      default: "new",
    },

    urgent: { type: Boolean, default: false }, // set by escalation rules

    aiReply: String,
    appointmentTime: Date,

    repliedAt: Date,
    bookedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Submission ||
  mongoose.model("Submission", SubmissionSchema);

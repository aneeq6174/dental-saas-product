import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema(
  { question: String, answer: String },
  { _id: false }
);

const EscalationRuleSchema = new mongoose.Schema(
  { keyword: String, action: String }, // e.g. keyword: "emergency", action: "flag_urgent"
  { _id: false }
);

const ClinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // used in public form URL

    branding: {
      logoUrl: String,
      primaryColor: { type: String, default: "#2563eb" },
      displayName: String,
    },

    services: [String], // e.g. ["Cleaning", "Root Canal", "Checkup"]

    workingHours: {
      type: Map,
      of: String, // e.g. { monday: "9:00-17:00" }
      default: {},
    },

    calendlyLink: String,

    notificationChannels: {
      discordWebhook: String,
      notifyEmail: String,
    },

    aiConfig: {
      tone: { type: String, enum: ["formal", "friendly"], default: "friendly" },
      languages: { type: [String], default: ["en"] },
      faqAnswers: [FaqSchema],
      escalationRules: [EscalationRuleSchema],
    },

    addOns: {
      followUpNoShow: {
        enabled: { type: Boolean, default: false },
        delayHours: { type: Number, default: 24 },
      },
      postBookingConfirmation: {
        enabled: { type: Boolean, default: false },
      },
      reminderBeforeAppointment: {
        enabled: { type: Boolean, default: false },
        hoursBefore: { type: Number, default: 2 },
      },
    },

    subscriptionStatus: {
      type: String,
      enum: ["trial", "active", "cancelled"],
      default: "trial",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Clinic || mongoose.model("Clinic", ClinicSchema);

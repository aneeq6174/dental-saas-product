"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewClinicPage() {
  const [form, setForm] = useState({
    name: "",
    ownerEmail: "",
    slug: "",
    calendlyLink: "",
    servicesText: "",
    tone: "friendly",
    faqText: "",
    discordWebhook: "",
    dashboardPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const parseFaq = (text) => {
    if (!text.trim()) return [];
    return text
      .split(/\n\s*\n/)
      .map((block) => {
        const qMatch = block.match(/Q:\s*(.+)/i);
        const aMatch = block.match(/A:\s*(.+)/i);
        return qMatch && aMatch ? { question: qMatch[1].trim(), answer: aMatch[1].trim() } : null;
      })
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      ownerEmail: form.ownerEmail,
      slug: form.slug,
      dashboardPassword: form.dashboardPassword,
      calendlyLink: form.calendlyLink,
      services: form.servicesText.split(",").map((s) => s.trim()).filter(Boolean),
      branding: { displayName: form.name },
      aiConfig: {
        tone: form.tone,
        faqAnswers: parseFaq(form.faqText),
      },
      notificationChannels: {
        discordWebhook: form.discordWebhook || undefined,
      },
    };

    const res = await fetch("/api/admin/clinics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setCreated({ slug: form.slug, password: form.dashboardPassword });
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create clinic");
    }
    setSaving(false);
  };

  if (created) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return (
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-2">Clinic created ✅</h1>
        <p className="text-gray-500 mb-6">Send the doctor these two links.</p>

        <div className="border rounded-lg p-4 mb-4">
          <p className="text-sm font-medium mb-1">Patient intake form (put this on their website)</p>
          <code className="text-sm text-blue-600 break-all">{origin}/intake/{created.slug}</code>
        </div>

        <div className="border rounded-lg p-4 mb-6">
          <p className="text-sm font-medium mb-1">Doctor's dashboard login</p>
          <p className="text-sm text-gray-600">Login page: <code className="text-blue-600">{origin}/clinic-login</code></p>
          <p className="text-sm text-gray-600">Clinic ID: <code>{created.slug}</code></p>
          <p className="text-sm text-gray-600">Password: <code>{created.password}</code></p>
        </div>

        <Link href="/admin" className="text-blue-600 text-sm">← Back to clinics</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Add New Clinic</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Clinic Name</label>
          <input name="name" required value={form.name} onChange={handleChange} className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Owner Email</label>
          <input name="ownerEmail" type="email" required value={form.ownerEmail} onChange={handleChange} className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug / Clinic ID (used in form URL and doctor login, e.g. "smile-dental")</label>
          <input name="slug" required value={form.slug} onChange={handleChange} className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Doctor's Dashboard Password</label>
          <input name="dashboardPassword" required value={form.dashboardPassword} onChange={handleChange} className="w-full border rounded-md p-2" placeholder="Pick something simple you'll tell them" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Calendly Link</label>
          <input name="calendlyLink" value={form.calendlyLink} onChange={handleChange} className="w-full border rounded-md p-2" placeholder="https://calendly.com/..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Services (comma-separated)</label>
          <input name="servicesText" value={form.servicesText} onChange={handleChange} className="w-full border rounded-md p-2" placeholder="Cleaning, Root Canal, Checkup" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">AI Tone</label>
          <select name="tone" value={form.tone} onChange={handleChange} className="w-full border rounded-md p-2">
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">FAQ / Instructions for AI</label>
          <textarea
            name="faqText"
            value={form.faqText}
            onChange={handleChange}
            rows={6}
            className="w-full border rounded-md p-2 font-mono text-sm"
            placeholder={"Q: Do you accept insurance?\nA: Yes, most major providers.\n\nQ: What are your hours?\nA: Mon-Fri 9am-5pm."}
          />
          <p className="text-xs text-gray-500 mt-1">Add Q/A pairs separated by a blank line — the AI will use these as ground truth.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Discord Webhook (optional)</label>
          <input name="discordWebhook" value={form.discordWebhook} onChange={handleChange} className="w-full border rounded-md p-2" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50">
          {saving ? "Creating..." : "Create Clinic"}
        </button>
      </form>
    </div>
  );
}
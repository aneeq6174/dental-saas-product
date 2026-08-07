"use client";

import { useState } from "react";

export default function IntakeForm({ clinicSlug }) {
  const [form, setForm] = useState({ patientName: "", email: "", phone: "", query: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicSlug, ...form }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-medium">Thank you, {form.patientName}!</p>
        <p className="text-gray-600 mt-1">Check your email for a reply and booking link shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        name="patientName"
        placeholder="Full name"
        required
        value={form.patientName}
        onChange={handleChange}
        className="w-full border rounded-md p-2"
      />
      <input
        name="email"
        type="email"
        placeholder="Email address"
        required
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded-md p-2"
      />
      <input
        name="phone"
        placeholder="Phone number"
        value={form.phone}
        onChange={handleChange}
        className="w-full border rounded-md p-2"
      />
      <textarea
        name="query"
        placeholder="What can we help you with?"
        rows={4}
        value={form.query}
        onChange={handleChange}
        className="w-full border rounded-md p-2"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Submit"}
      </button>
      {status === "error" && (
        <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

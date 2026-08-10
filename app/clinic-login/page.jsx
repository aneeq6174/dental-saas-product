"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClinicLoginPage() {
  const [slug, setSlug] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/clinic/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, password }),
    });
    if (res.ok) {
      router.push("/clinic-dashboard");
    } else {
      setError("Incorrect clinic ID or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1">Clinic Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to view your patient enquiries</p>
        <input
          placeholder="Clinic ID"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border rounded-md p-2 mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md p-2 mb-4"
          required
        />
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-medium">
          Sign In
        </button>
      </form>
    </div>
  );
}
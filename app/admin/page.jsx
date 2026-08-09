"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/clinics")
      .then((res) => res.json())
      .then((data) => setClinics(data.clinics || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Clinics</h1>
        <Link href="/admin/clinics/new" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
          + Add Clinic
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && clinics.length === 0 && (
        <p className="text-gray-500">No clinics yet. Click "Add Clinic" to onboard your first one.</p>
      )}

      <div className="space-y-3">
        {clinics.map((c) => (
          <div key={c._id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-500">Slug: {c.slug} · {c.ownerEmail}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link href={`/admin/clinics/${c._id}`} className="text-blue-600">Edit</Link>
              <Link href={`/dashboard?clinicId=${c._id}`} className="text-gray-600">View Dashboard</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
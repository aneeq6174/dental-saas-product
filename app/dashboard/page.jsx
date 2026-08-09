"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const statusColors = {
  new: "bg-gray-200 text-gray-800",
  ai_replied: "bg-blue-100 text-blue-800",
  booked: "bg-green-100 text-green-800",
  no_show: "bg-red-100 text-red-800",
  completed: "bg-purple-100 text-purple-800",
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const clinicId = searchParams.get("clinicId");

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clinicId) {
      setLoading(false);
      return;
    }
    fetch(`/api/admin/submissions?clinicId=${clinicId}`)
      .then((res) => res.json())
      .then((data) => setSubmissions(data.submissions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [clinicId]);

  if (!clinicId) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <p className="text-gray-500">No clinic selected. Go to the admin panel and click "View Dashboard" on a clinic.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Patient Submissions</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && submissions.length === 0 && (
        <p className="text-gray-500">No submissions yet. Once patients fill your intake form, they'll appear here.</p>
      )}

      <div className="space-y-3">
        {submissions.map((s) => (
          <div key={s._id} className="border rounded-lg p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">
                {s.patientName} {s.urgent && <span className="text-red-600 text-sm ml-2">⚠ Urgent</span>}
              </p>
              <p className="text-sm text-gray-500">{s.email}</p>
              <p className="text-sm mt-1">{s.query}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[s.status] || ""}`}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
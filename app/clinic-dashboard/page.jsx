"use client";

import { useEffect, useState } from "react";

const statusColors = {
  new: "bg-gray-200 text-gray-800",
  ai_replied: "bg-blue-100 text-blue-800",
  booked: "bg-green-100 text-green-800",
  no_show: "bg-red-100 text-red-800",
  completed: "bg-purple-100 text-purple-800",
};

export default function ClinicDashboardPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = () => {
    fetch("/api/clinic/submissions")
      .then((res) => res.json())
      .then((data) => setSubmissions(data.submissions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const markCompleted = async (submissionId) => {
    setUpdating(submissionId);
    await fetch("/api/clinic/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId, status: "completed" }),
    });
    await load();
    setUpdating(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Patient Enquiries</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && submissions.length === 0 && (
        <p className="text-gray-500">No submissions yet. Once patients fill your intake form, they'll appear here.</p>
      )}

      <div className="space-y-3">
        {submissions.map((s) => (
          <div key={s._id} className="border rounded-lg p-4 flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="font-medium">
                {s.patientName} {s.urgent && <span className="text-red-600 text-sm ml-2">⚠ Urgent</span>}
              </p>
              <p className="text-sm text-gray-500">{s.email}</p>
              <p className="text-sm mt-1">{s.query}</p>
              {s.appointmentTime && (
                <p className="text-xs text-gray-400 mt-1">
                  Appointment: {new Date(s.appointmentTime).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[s.status] || ""}`}>
                {s.status}
              </span>
              {(s.status === "booked" || s.status === "no_show") && (
                <button
                  onClick={() => markCompleted(s._id)}
                  disabled={updating === s._id}
                  className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                >
                  {updating === s._id ? "Saving..." : "Mark patient as seen"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
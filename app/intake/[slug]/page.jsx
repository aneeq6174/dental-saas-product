"use client";

import { useEffect, useState } from "react";
import { use as usePromise } from "react";
import IntakeForm from "@/components/Forms/IntakeForm";

export default function PublicIntakePage({ params }) {
  const { slug } = usePromise(params);
  const [clinic, setClinic] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/public/clinic/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => setClinic(data.clinic))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">This clinic page could not be found.</p>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border p-8 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-1">{clinic.branding?.displayName || clinic.name}</h1>
        <p className="text-sm text-gray-500 mb-6">Tell us what you need — we'll reply right away.</p>
        <IntakeForm clinicSlug={clinic.slug} />
      </div>
    </div>
  );
}
// Generates a clinic-specific AI reply using the clinic's config as grounding context.

export async function checkEscalation(clinic, submission) {
  const text = `${submission.query || ""} ${JSON.stringify(submission.formData || {})}`.toLowerCase();
  const rules = clinic.aiConfig?.escalationRules || [];
  for (const rule of rules) {
    if (rule.keyword && text.includes(rule.keyword.toLowerCase())) {
      return { urgent: true, action: rule.action };
    }
  }
  return { urgent: false, action: null };
}

export async function generateAiReply(clinic, submission) {
  const faqBlock = (clinic.aiConfig?.faqAnswers || [])
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n");

  const systemPrompt = `You are the patient-intake assistant for ${clinic.branding?.displayName || clinic.name}.
Tone: ${clinic.aiConfig?.tone || "friendly"}.
Services offered: ${(clinic.services || []).join(", ") || "general dental services"}.

Known FAQs for this clinic (use these facts if relevant, do not invent facts not listed here):
${faqBlock || "None provided."}

Write a short, warm reply to the patient's message below. Confirm you received their request,
briefly address their query using only the facts given above, and tell them to use the booking
link (it will be appended separately, do not invent a link) to pick an appointment time.
Do not make medical diagnoses or promises about specific treatment outcomes.`;

  const userMessage = `Patient name: ${submission.patientName}
Patient message: ${submission.query || "(no message provided)"}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI API error: ${errText}`);
  }

  const data = await response.json();
  return (
    data.choices?.[0]?.message?.content ||
    "Thank you for reaching out — we'll be in touch shortly."
  );
}
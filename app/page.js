const demoSteps = [
  { label: "Patient enquiry received", time: "09:14", detail: "\u201cDo you have anything this week for a check-up?\u201d", tag: "New", tagColor: "bg-[var(--line)] text-[var(--ink)]" },
  { label: "AI reply sent", time: "09:14", detail: "Reply drafted from your clinic's own hours & services, sent in seconds.", tag: "Replied", tagColor: "bg-[color:rgb(11_110_92/0.12)] text-[var(--teal-dark)]" },
  { label: "Appointment booked", time: "09:21", detail: "Patient picked Thursday 3:40pm from the link in their email.", tag: "Booked", tagColor: "bg-[color:rgb(47_158_68/0.14)] text-[var(--signal)]" },
  { label: "No-show follow-up armed", time: "Automatic", detail: "If they don't arrive, a reschedule email goes out — no one has to remember.", tag: "Automated", tagColor: "bg-[color:rgb(184_121_26/0.14)] text-[var(--gold)]" },
];

const steps = [
  { n: "01", title: "Patient fills a short form", desc: "Embedded on your website, live around the clock — no app for them to download." },
  { n: "02", title: "AI replies in your voice", desc: "Grounded in your services, hours and FAQs. Nothing invented, nothing generic." },
  { n: "03", title: "They book in one click", desc: "A scheduling link in the same email — no phone tag, no back-and-forth." },
  { n: "04", title: "You see it all in one place", desc: "A single dashboard for every enquiry, every booking, every no-show." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-7">
        <span className="font-display text-[1.35rem] tracking-tight">DentalAI</span>
        <div className="flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors hidden sm:inline">How it works</a>
          <a href="#trust" className="text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors hidden sm:inline">Data & compliance</a>
          <a href="/admin/login" className="text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors">Admin</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
        <div className="reveal">
          <p className="font-mono text-xs tracking-widest uppercase text-[var(--teal-dark)] mb-5">
            For dental &amp; medical clinics
          </p>
          <h1 className="font-display text-[2.75rem] sm:text-[3.4rem] leading-[1.05] tracking-tight">
            Every patient message,
            <br />
            answered before they
            <br />
            close the tab.
          </h1>
          <p className="mt-6 text-lg text-[var(--ink)]/70 max-w-md leading-relaxed">
            An intake assistant that replies instantly, books the appointment, and
            chases the no-shows — so nothing sits in an inbox overnight again.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="https://calendly.com/aneeqijaz99/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--teal)] hover:bg-[var(--teal-dark)] transition-colors text-white px-7 py-3.5 rounded-lg font-medium text-[15px]"
            >
              Book a 30-min demo
            </a>
            <span className="text-sm text-[var(--ink)]/50">No setup on your end — we configure it with you.</span>
          </div>
        </div>

        {/* Signature element: live cycling product demo */}
        <div className="reveal" style={{ animationDelay: "0.15s" }}>
          <div className="relative rounded-2xl border border-[var(--line)] bg-white shadow-[0_1px_2px_rgba(20,35,31,0.04),0_16px_40px_-16px_rgba(20,35,31,0.18)] p-6 h-[260px] overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[11px] tracking-wider text-[var(--ink)]/40 uppercase">Live enquiry</span>
              <span className="w-2 h-2 rounded-full bg-[var(--signal)]" />
            </div>
            <div className="relative h-[170px]">
              {demoSteps.map((s, i) => (
                <div
                  key={s.label}
                  className="demo-step absolute inset-x-0 top-0"
                  
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-[15px]">{s.label}</span>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${s.tagColor}`}>{s.tag}</span>
                  </div>
                  <p className="text-sm text-[var(--ink)]/60 leading-relaxed pr-4">{s.detail}</p>
                  <p className="font-mono text-[11px] text-[var(--ink)]/35 mt-3">{s.time}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-[var(--ink)]/40 mt-3 text-center">A real enquiry, start to finish — this is the actual flow.</p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl mb-14">How it works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="font-mono text-sm text-[var(--teal)]">{s.n}</span>
                <h3 className="font-display text-xl mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--ink)]/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / compliance */}
      <section id="trust" className="border-t border-[var(--line)] bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
          <div>
            <h2 className="font-display text-3xl mb-4">Built for patient data,<br />not general chat.</h2>
            <p className="text-[var(--ink)]/60 leading-relaxed max-w-sm">
              Every reply is grounded in what your clinic actually offers — never invented,
              never off-script. Sensitive details stay behind your login, not in a public channel.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {[
              ["Encrypted storage", "Patient data encrypted at rest and in transit, always."],
              ["No invented answers", "The AI only uses facts you've given it about your clinic."],
              ["You control retention", "Set how long enquiry data is kept, per clinic."],
              ["One dashboard, one login", "No patient details sit in shared chat channels."],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] mt-2 shrink-0" />
                <div>
                  <p className="font-medium text-[15px]">{title}</p>
                  <p className="text-sm text-[var(--ink)]/55 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-3xl sm:text-4xl mb-5">See it running on your own enquiries.</h2>
          <p className="text-[var(--ink)]/60 mb-9 max-w-md mx-auto">
            A 30-minute call — we'll show you the full flow, and what it takes to set up.
          </p>
          <a
            href="https://calendly.com/aneeqijaz99/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[var(--teal)] hover:bg-[var(--teal-dark)] transition-colors text-white px-8 py-3.5 rounded-lg font-medium text-[15px]"
          >
            Book a 30-min demo
          </a>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] py-8 text-center text-sm text-[var(--ink)]/40">
        © {new Date().getFullYear()} DentalAI. All rights reserved.
      </footer>
    </div>
  );
}
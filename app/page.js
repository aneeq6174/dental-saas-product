export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <span className="text-xl font-semibold text-gray-900">DentalAI</span>
        <a href="/admin/login" className="text-sm text-gray-600 hover:text-gray-900">Admin Login</a>
      </nav>

      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight">
          Never miss a patient enquiry again
        </h1>
        <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
          An AI intake assistant that replies to patients instantly, books their appointment,
          and follows up automatically — so your front desk doesn't have to.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a href="mailto:aneeq@solvistack.com" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
            Book a Demo
          </a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">How it works</h2>
        <div className="grid sm:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Patient submits a form", desc: "On your website, any time, day or night." },
            { step: "2", title: "AI replies instantly", desc: "Answers questions using your clinic's own info." },
            { step: "3", title: "Patient books", desc: "Straight from the email, no back-and-forth." },
            { step: "4", title: "You get notified", desc: "See it all on your dashboard, in real time." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 font-medium">
                {item.step}
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} DentalAI. All rights reserved.
      </footer>
    </div>
  );
}
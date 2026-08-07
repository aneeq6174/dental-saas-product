import "./globals.css";

export const metadata = {
  title: "Dental AI Intake",
  description: "AI-powered patient intake for dental clinics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

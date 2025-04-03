import { AuthProvider } from "@/context/auth-context";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATS-Friendly Resume Builder | Create Professional Resumes",
  description: "Build a professionally formatted, ATS-friendly resume in minutes. Free templates, expert tips, and easy-to-use editor for job search success.",
  keywords: "resume builder, ATS resume, applicant tracking system, professional resume, job application, resume templates",
  // authors: [{ name: "Your Company Name" }],
  // creator: "Your Company Name",
  // publisher: "Your Company Name",
  openGraph: {
    title: "ATS-Friendly Resume Builder | Create Professional Resumes",
    description: "Build a professionally formatted, ATS-friendly resume in minutes. Free templates, expert tips, and easy-to-use editor for job search success.",
    // url: "https://your-domain.com",
    siteName: "ATS-Friendly Resume Builder",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS-Friendly Resume Builder | Create Professional Resumes",
    description: "Build a professionally formatted, ATS-friendly resume in minutes. Free templates, expert tips, and easy-to-use editor for job search success.",
    creator: "@the_flutter_ninja",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

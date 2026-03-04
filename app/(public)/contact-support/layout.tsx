import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Support",
  description:
    "Need help with AutoCrew? Contact our support team for access requests, technical issues, or account questions. We respond quickly.",
  alternates: {
    canonical: "/contact-support",
  },
};

export default function ContactSupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

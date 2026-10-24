import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | CASE SUNO",
  description: "How CASE SUNO collects, stores and protects your information and documents.",
};

export default function PrivacyPolicyPage() {
  return <LegalPage type="privacy" />;
}
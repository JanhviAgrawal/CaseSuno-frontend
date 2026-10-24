import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | CASE SUNO",
  description: "The terms that govern the use of CASE SUNO's coordination and documentation services.",
};

export default function TermsPage() {
  return <LegalPage type="terms" />;
}
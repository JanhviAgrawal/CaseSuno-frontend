import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer | CASE SUNO",
  description: "Regulatory disclaimer and Bar Council of India compliance information for CASE SUNO.",
};

export default function DisclaimerPage() {
  return <LegalPage type="disclaimer" />;
}
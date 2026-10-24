import type { Metadata } from "next";
import { FaqPage } from "../../components/pages/FaqPage";

export const metadata: Metadata = {
  title: "FAQ | CASE SUNO",
  description: "Answers about CASE SUNO's services, confidentiality, charges and appointment-based assistance.",
};

export default function Page() {
  return <FaqPage />;
}
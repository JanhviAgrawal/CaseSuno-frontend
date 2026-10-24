import type { Metadata } from "next";
import { ContactPage } from "../../components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact | CASE SUNO",
  description: "Call, WhatsApp or email CASE SUNO, or request an online appointment slot.",
};

export default function Page() {
  return <ContactPage />;
}
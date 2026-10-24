import type { Metadata } from "next";
import { AboutPage } from "../../components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About | CASE SUNO",
  description: "CASE SUNO listens, organises your documents and connects you with independent professionals only when needed.",
};

export default function Page() {
  return <AboutPage />;
}
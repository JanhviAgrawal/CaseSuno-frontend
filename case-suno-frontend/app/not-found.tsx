import type { Metadata } from "next";
import { NotFoundPage } from "../components/pages/NotFoundPage";

export const metadata: Metadata = {
  title: "Page not found | CASE SUNO",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundPage />;
}

import type { Metadata } from "next";
import { ResourcesPage } from "../../components/pages/ResourcesPage";

export const metadata: Metadata = {
  title: "Resources & Checklists | CASE SUNO",
  description: "Free, practical checklists to help you organise facts and documents before consulting professionals.",
};

export default function Page() {
  return <ResourcesPage />;
}
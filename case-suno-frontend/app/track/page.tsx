import type { Metadata } from "next";
import { TrackLookupPage } from "../../components/pages/TrackLookupPage";

export const metadata: Metadata = {
  title: "Track Your Request | CASE SUNO",
  description: "Check the status of your CASE SUNO enquiry using your reference number and mobile number.",
};

export default function Page() {
  return <TrackLookupPage />;
}
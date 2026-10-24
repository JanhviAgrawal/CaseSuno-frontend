"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ServicesSection, type ServiceItem } from "../components/ServicesSection";
import { ProcessSection } from "../components/ProcessSection";
import { WhyChooseSection } from "../components/WhyChooseSection";
import { BeliefBanner } from "../components/BeliefBanner";
import { CtaSection } from "../components/CtaSection";
import { Footer } from "../components/Footer";
import { ServiceDetailModal } from "../components/ServiceDetailModal";
import { useSiteActions } from "../context/SiteActionsContext";

export default function Home() {
  const router = useRouter();
  const { openEnquiry, openWhatsAppDrawer } = useSiteActions();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#222222] font-sans antialiased">
      <Header />

      <main className="flex-1">
        <Hero onOpenEnquiry={openEnquiry} onOpenLocationInfo={() => router.push("/contact")} />
        <ServicesSection onSelectService={setSelectedService} />
        <ProcessSection onKnowMore={() => router.push("/faq")} onOpenEnquiry={() => openEnquiry()} />
        <WhyChooseSection />
        <BeliefBanner onOurStory={() => router.push("/about")} />
        <CtaSection onStartEnquiry={() => openEnquiry()} onOpenWhatsApp={openWhatsAppDrawer} />
      </main>

      <Footer />

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onStartEnquiry={(serviceId) => {
          setSelectedService(null);
          openEnquiry(serviceId);
        }}
      />
    </div>
  );
}
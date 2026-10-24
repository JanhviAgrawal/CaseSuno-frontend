"use client";

import React from "react";
import { LanguageProvider } from "../context/LanguageContext";
import { SiteActionsProvider } from "../context/SiteActionsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SiteActionsProvider>{children}</SiteActionsProvider>
    </LanguageProvider>
  );
}
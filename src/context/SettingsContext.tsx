'use client';

import React, { createContext, useContext } from 'react';

interface PublicSettings {
  whatsappNumber: string;
  phone: string;
}

const SettingsContext = createContext<PublicSettings>({
  whatsappNumber: '905325502026',
  phone: '0 (216) 550 20 26',
});

export function SettingsProvider({
  value,
  children,
}: {
  value: PublicSettings;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function usePublicSettings() {
  return useContext(SettingsContext);
}

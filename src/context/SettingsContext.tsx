'use client';

import React, { createContext, useContext } from 'react';

interface PublicSettings {
  whatsappNumber: string;
  phone: string;
}

const SettingsContext = createContext<PublicSettings>({
  whatsappNumber: '905453467986',
  phone: '0 (545) 346 79 86',
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

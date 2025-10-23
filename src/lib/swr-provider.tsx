"use client";

import { SWRConfig } from "swr";

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        refreshInterval: 10000,
        fetcher: async (...args: Parameters<typeof fetch>) => (await fetch(...args)).json(),
      }}
    >
      {children}
    </SWRConfig>
  );
};

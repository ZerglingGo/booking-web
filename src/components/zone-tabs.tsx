"use client";

import useSWR from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ZoneTabs() {
  const { data } = useSWR<Zone[]>("/api/zones");

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue={data?.[0]?.id.toString()} className="w-full">
      <TabsList>
        {data?.map((zone) => (
          <TabsTrigger key={zone.id} value={zone.id.toString()}>
            {zone.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {data?.map((zone) => (
        <TabsContent key={zone.id} value={zone.id.toString()}>
          <div className="whitespace-pre-line rounded-lg border p-4 text-sm shadow">{zone.description}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

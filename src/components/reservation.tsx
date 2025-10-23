"use client";

import { useState } from "react";
import { ko } from "react-day-picker/locale";
import SiteSelector from "@/components/site-selector";
import { Calendar } from "@/components/ui/calendar";
import ZoneSelector from "@/components/zone-selector";

export default function Reservation() {
  const [date, setDate] = useState<Date>(new Date());
  const [zone, setZone] = useState<Zone | null>(null);
  const [site, setSite] = useState<Site | null>(null);

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="mx-auto rounded-lg border"
        numberOfMonths={2}
        required
        disabled={{ before: new Date(), after: new Date(new Date().setDate(new Date().getDate() + 13)) }}
        locale={ko}
      />

      {!zone && <ZoneSelector setZone={setZone} />}
      {zone && <SiteSelector zone={zone} site={site} date={date} setZone={setZone} setSite={setSite} />}
    </div>
  );
}

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
  const [additionalPerson, setAdditionalPerson] = useState<number>(0);

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="mx-auto rounded-lg border"
        numberOfMonths={2}
        required
        disabled={{ before: new Date(), ...(zone && { after: zone.close_at }) }}
        locale={ko}
      />

      {!zone && <ZoneSelector date={date} setZone={setZone} />}
      {zone && (
        <SiteSelector zone={zone} site={site} date={date} setZone={setZone} setSite={setSite} additionalPerson={additionalPerson} setAdditionalPerson={setAdditionalPerson} />
      )}
    </div>
  );
}

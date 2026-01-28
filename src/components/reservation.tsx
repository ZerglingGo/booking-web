"use client";

import { useEffect, useState } from "react";
import SiteSelector from "@/components/site-selector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ZoneSelector from "@/components/zone-selector";

const addDays = (base: Date, days: number) => {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
};

const toMonthKey = (value: Date) => `${value.getFullYear()}-${value.getMonth()}`;

export default function Reservation() {
  const [date, setDate] = useState<Date>(new Date());
  const [zone, setZone] = useState<Zone | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [additionalPerson, setAdditionalPerson] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => toMonthKey(new Date()));

  const today = new Date();
  const minDate = zone?.open_at ?? today;
  const maxDate = zone?.close_at ?? addDays(minDate, 90);

  const monthOptions = (() => {
    const options: { key: string; label: string }[] = [];
    const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

    while (cursor <= end) {
      options.push({
        key: toMonthKey(cursor),
        label: cursor.toLocaleDateString("ko-KR", { year: "numeric", month: "long" }),
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return options;
  })();

  const totalDays = Math.max(1, Math.floor((maxDate.getTime() - minDate.getTime()) / 86400000) + 1);
  const dateOptions = Array.from({ length: totalDays }, (_, index) => addDays(minDate, index)).filter(
    (option) => toMonthKey(option) === selectedMonth && option >= minDate && option <= maxDate,
  );

  useEffect(() => {
    if (!monthOptions.length) {
      return;
    }

    if (!monthOptions.some((option) => option.key === selectedMonth)) {
      setSelectedMonth(monthOptions[0].key);
    }
  }, [monthOptions, selectedMonth]);

  useEffect(() => {
    if (!dateOptions.length) {
      return;
    }

    const isCurrentInMonth = dateOptions.some((option) => option.toDateString() === date.toDateString());
    if (!isCurrentInMonth) {
      setDate(dateOptions[0]);
    }
  }, [dateOptions, date]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="월 선택" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((option) => (
              <SelectItem key={option.key} value={option.key}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mx-auto flex w-full gap-2 overflow-x-auto rounded-lg border p-3">
        {dateOptions.map((option) => {
          const isSelected = option.toDateString() === date.toDateString();
          const isSunday = option.getDay() === 0;
          return (
            <button
              key={option.toISOString()}
              type="button"
              onClick={() => setDate(option)}
              className={`min-w-[88px] rounded-md border px-3 py-2 text-sm transition ${
                isSelected ? "border-primary bg-secondary text-primary" : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <div className="font-semibold">{option.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}</div>
              <div className={`text-xs ${isSunday ? "text-red-500" : "text-muted-foreground"}`}>{option.toLocaleDateString("ko-KR", { weekday: "short" })}</div>
            </button>
          );
        })}
      </div>

      {!zone && <ZoneSelector date={date} setZone={setZone} />}
      {zone && (
        <SiteSelector zone={zone} site={site} date={date} setZone={setZone} setSite={setSite} additionalPerson={additionalPerson} setAdditionalPerson={setAdditionalPerson} />
      )}
    </div>
  );
}

"use client";

import { format } from "date-fns/format";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ko } from "react-day-picker/locale";
import useSWR from "swr";
import SiteSelector from "@/components/site-selector";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ZoneSelector from "@/components/zone-selector";

const addDays = (base: Date, days: number) => {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
};

const toMonthKey = (value: Date) => `${value.getFullYear()}-${value.getMonth()}`;
const toDateKey = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const normalizeDate = (value?: Date | string | null) => {
  if (!value) {
    return undefined;
  }
  if (value instanceof Date) {
    return value;
  }
  return new Date(`${value}T00:00:00`);
};

export default function Reservation() {
  const [date, setDate] = useState<Date>(new Date());
  const [zone, setZone] = useState<Zone | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [additionalPerson, setAdditionalPerson] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => toMonthKey(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const dateListRef = useRef<HTMLDivElement | null>(null);
  const todayRef = useRef(new Date());
  const lastActionRef = useRef<"init" | "list" | "month" | "calendar">("init");

  const today = todayRef.current;
  const dateString = format(date, "yyyy-MM-dd");
  const { data: pricedZones } = useSWR<Zone[]>(zone ? `/api/zones?date=${dateString}` : null);
  const zoneOpenAt = normalizeDate(zone?.open_at);
  const zoneCloseAt = normalizeDate(zone?.close_at);
  const minDate = zoneOpenAt ?? today;
  const maxDate = zoneCloseAt ?? addDays(minDate, 365);

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
      lastActionRef.current = "month";
      setSelectedMonth(monthOptions[0].key);
    }
  }, [monthOptions, selectedMonth]);

  useEffect(() => {
    if (!dateOptions.length) {
      return;
    }

    const isCurrentInMonth = dateOptions.some((option) => option.toDateString() === date.toDateString());
    if (!isCurrentInMonth) {
      lastActionRef.current = "month";
      setDate(dateOptions[0]);
    }
  }, [dateOptions, date]);

  useEffect(() => {
    if (!dateOptions.length) {
      return;
    }

    const selectedKey = toDateKey(date);
    const todayKey = toDateKey(today);
    const availableKeys = new Set(dateOptions.map((option) => toDateKey(option)));
    const targetKey = availableKeys.has(selectedKey) ? selectedKey : availableKeys.has(todayKey) ? todayKey : toDateKey(dateOptions[0]);

    const container = dateListRef.current;
    const target = container?.querySelector<HTMLButtonElement>(`[data-date="${targetKey}"]`);
    if (!target) {
      return;
    }

    const containerRect = container?.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const isVisible = containerRect ? targetRect.left >= containerRect.left && targetRect.right <= containerRect.right : true;
    const shouldScroll = lastActionRef.current !== "list" || !isVisible;

    if (!shouldScroll) {
      return;
    }

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      lastActionRef.current = "init";
    });
  }, [dateOptions, date, today]);

  useEffect(() => {
    if (!zone || !pricedZones?.length) {
      return;
    }

    const latestZone = pricedZones.find((candidate) => candidate.id === zone.id);
    if (!latestZone) {
      return;
    }

    setZone((prev) => {
      if (!prev) {
        return prev;
      }

      if (prev.price === latestZone.price && prev.additional_person_price === latestZone.additional_person_price) {
        return prev;
      }

      return {
        ...prev,
        price: latestZone.price,
        additional_person_price: latestZone.additional_person_price,
      };
    });
  }, [zone, pricedZones]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={selectedMonth}
          onValueChange={(value) => {
            lastActionRef.current = "month";
            setSelectedMonth(value);
          }}
        >
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

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" type="button">
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selected) => {
                if (!selected) {
                  return;
                }
                lastActionRef.current = "calendar";
                setDate(selected);
                setSelectedMonth(toMonthKey(selected));
                setCalendarOpen(false);
              }}
              disabled={zone ? { before: zoneOpenAt || today, after: zoneCloseAt || today } : { before: minDate, after: maxDate }}
              locale={ko}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div ref={dateListRef} className="mx-auto flex w-full gap-2 overflow-x-auto rounded-lg border p-3">
        {dateOptions.map((option) => {
          const isSelected = option.toDateString() === date.toDateString();
          const isSunday = option.getDay() === 0;
          return (
            <button
              key={option.toISOString()}
              data-date={toDateKey(option)}
              type="button"
              onClick={() => {
                lastActionRef.current = "list";
                setDate(option);
              }}
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

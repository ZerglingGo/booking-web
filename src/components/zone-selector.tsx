"use client";

import { format } from "date-fns/format";
import Image from "next/image";
import useSWR from "swr";

export default function ZoneSelector({ date, setZone }: { date: Date; setZone: (zone: Zone) => void }) {
  const dateString = format(date, "yyyy-MM-dd");
  const { data } = useSWR<Zone[]>(`/api/zones?date=${dateString}`);

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
      {data?.map((zone) => (
        <button key={`zone-${zone.id}`} type="button" className="cursor-pointer rounded-lg p-2 text-left transition hover:bg-neutral-100" onClick={() => setZone(zone)}>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            {zone.cover_image_url && <Image fill objectFit="cover" src={zone.cover_image_url} alt="커버 이미지" className="pointer-events-none" />}
          </div>

          <div className="mt-2">
            <h2 className="font-extrabold text-lg xl:mb-1 xl:text-2xl">{zone.name}</h2>
            <span className="font-bold text-red-500 text-sm xl:text-lg">{zone.price.toLocaleString("ko-KR")}원</span>
          </div>
        </button>
      ))}
    </div>
  );
}

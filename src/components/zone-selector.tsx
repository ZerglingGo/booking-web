"use client";

import Image from "next/image";
import useSWR from "swr";

export default function ZoneSelector({ setZone }: { setZone: (zone: Zone) => void }) {
  const { data } = useSWR<Zone[]>("/api/zones");

  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      {data?.map((zone) => (
        <button key={`zone-${zone.id}`} type="button" className="cursor-pointer rounded-lg p-2 text-left transition hover:bg-neutral-100" onClick={() => setZone(zone)}>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            {zone.cover_image && <Image fill objectFit="cover" src={zone.cover_image} alt="커버 이미지" />}
          </div>

          <div className="mt-2">
            <h2 className="mb-1 font-extrabold text-2xl">{zone.name}</h2>
            <span className="font-bold text-lg text-red-500">50,000원</span>
          </div>
        </button>
      ))}
    </div>
  );
}

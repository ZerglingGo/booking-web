"use client";

import { format } from "date-fns";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, MinusIcon, PlusIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function SiteSelector({
  zone,
  site,
  date,
  additionalPerson,
  setZone,
  setSite,
  setAdditionalPerson,
}: {
  zone: Zone;
  site: Site | null;
  date: Date;
  additionalPerson: number;
  setZone: (zone: Zone | null) => void;
  setSite: (site: Site) => void;
  setAdditionalPerson: (count: number) => void;
}) {
  const { data } = useSWR<Site[]>(`/api/zones/${zone.id}/sites`);

  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Button type="button" className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition" onClick={() => setZone(null)}>
          <ArrowLeftIcon />
          <span>뒤로가기</span>
        </Button>
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
        {zone.cover_image_url && <Image fill objectFit="cover" src={zone.cover_image_url} alt="커버 이미지" />}

        <div className="z-10 flex size-full flex-col justify-end gap-8 bg-black/75 p-8 text-background backdrop-blur-lg">
          <div className="flex items-end gap-8">
            <div className="relative h-[250px] w-[200px] overflow-hidden rounded-lg">
              {zone.cover_image_url && <Image fill objectFit="cover" src={zone.cover_image_url} alt="커버 이미지" />}
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-3xl">{zone.name}</span>

              <div className="mt-6 flex flex-col gap-2 text-secondary">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="text-neutral-400" />
                  <span className="text-neutral-400">이용일자</span>
                  <span>{format(date, "yyyy-MM-dd")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <ClockIcon className="text-neutral-400" />
                  <span className="text-neutral-400">이용시간</span>
                  <span>
                    {zone.check_in_time || "00:00"} - {zone.check_out_time || "23:59"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <UsersIcon className="text-neutral-400" />
                  <span className="text-neutral-400">기준인원</span>
                  <span>{zone.person_capacity || 0}명</span>
                </div>

                <div className="flex items-center gap-2">
                  <UsersIcon className="text-neutral-400" />
                  <span className="text-neutral-400">최대인원</span>
                  <span>{zone.person_capacity + zone.additional_person_capacity || 0}명</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-600" />

          <div className="text-right">
            <span className="font-extrabold text-2xl">{zone.price.toLocaleString("ko-KR")}원</span>
          </div>
        </div>
      </div>

      <div>
        <div className="rounded-lg border px-8 py-6">
          <h3 className="mb-4 font-bold text-lg">좌석 선택</h3>

          <div className="relative w-full overflow-hidden rounded-lg">
            {zone.map_image_url && <Image src={zone.map_image_url} alt="구역 이미지" width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} />}
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {data?.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSite(s)}
                className={cn("flex cursor-pointer flex-col items-center justify-center rounded-lg border p-2 text-sm hover:bg-primary/10", {
                  "border-primary bg-primary/20": site?.id === s.id,
                })}
              >
                <span className="font-semibold">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-lg border px-8 py-6">
          <h3 className="mb-4 font-bold text-lg">추가 인원</h3>

          <div className="mt-4 flex items-center justify-between">
            <ButtonGroup>
              <Button variant="outline" className="cursor-pointer" onClick={() => setAdditionalPerson(Math.max(0, additionalPerson - 1))}>
                <MinusIcon size={12} />
              </Button>
              <Input readOnly value={additionalPerson} className="flex w-12 items-center justify-center text-center" />
              <Button variant="outline" className="cursor-pointer" onClick={() => setAdditionalPerson(additionalPerson + 1)}>
                <PlusIcon size={12} />
              </Button>
            </ButtonGroup>

            <div>{(zone.additional_person_price * additionalPerson).toLocaleString("ko-KR")}원</div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span>총 결제금액</span>
            <span className="font-bold text-2xl text-red-500">{(zone.price + zone.additional_person_price * additionalPerson).toLocaleString("ko-KR")}원</span>
          </div>

          <Button className="cursor-pointer py-6 transition">예약하기</Button>
        </div>
      </div>

      <div className="col-span-2 whitespace-pre-line rounded-lg border p-4">{zone.description}</div>
    </div>
  );
}

"use client";

import type { CheckedState } from "@radix-ui/react-checkbox";
import { addDays, format } from "date-fns";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, MinusIcon, PlusIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    smartropay?: {
      init(config: { mode: "REAL" | "TEST" }): void;
      payment(options: { FormId: string; Callback(res: { Tid: string; TrAuthKey: string }): void }): void;
    };
  }
}

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
  const dateString = format(date, "yyyy-MM-dd");
  const { data } = useSWR<Site[]>(`/api/zones/${zone.id}/sites?date=${dateString}`);
  const { user, isAuthenticated } = useAuth();

  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [terms, setTerms] = useState<CheckedState>(false);

  // random string
  const mid = process.env.NEXT_PUBLIC_SMARTRO_MID;
  const ediDate = format(new Date(), "yyyyMMddHHmmss");
  const moidRef = useRef<HTMLInputElement>(null);
  const encDataRef = useRef<HTMLInputElement>(null);

  const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/smartro/approval`;
  const stopUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reservation`;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://tpay.smartropay.co.kr/asset/js/SmartroPAY-1.0.min.js?version=${format(new Date(), "yyyyMMdd")}`;
    script.type = "text/javascript";
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name ?? "");
    setContact(user.contact ?? "");
  }, [user]);

  const effectiveName = isAuthenticated ? (user?.name ?? name) : name;
  const effectiveContact = isAuthenticated ? (user?.contact ?? contact) : contact;

  const goPay = () => {
    if (!site) return;

    const amount = (zone.price + zone.additional_person_price * additionalPerson).toString();

    fetch("/api/smartro/moid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        date: format(date, "yyyy-MM-dd"),
        site_id: site.id,
        name: effectiveName,
        contact: effectiveContact,
        additional_person: additionalPerson,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!moidRef.current) return;

        moidRef.current.value = data.moid;

        fetch("/api/smartro/encrypt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: [ediDate, amount] }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!encDataRef.current) return;
            if (!window.smartropay) return;

            encDataRef.current.value = data.encrypted_data;

            window.smartropay.init({
              mode: "REAL",
            });

            window.smartropay.payment({
              FormId: "tranMgr",
              Callback: (res) => {
                var approvalForm = document.getElementById("approvalForm") as HTMLFormElement;
                approvalForm.Tid.defaultValue = res.Tid;
                approvalForm.TrAuthKey.defaultValue = res.TrAuthKey;
                approvalForm.action = returnUrl;
                approvalForm.submit();
              },
            });
          });
      });
  };

  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Button type="button" className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition" onClick={() => setZone(null)}>
          <ArrowLeftIcon />
          <span>뒤로가기</span>
        </Button>
      </div>

      <div className="relative col-span-2 aspect-square w-full overflow-hidden rounded-lg shadow-lg lg:col-span-1">
        {zone.cover_image_url && <Image fill objectFit="cover" src={zone.cover_image_url} alt="커버 이미지" />}

        <div className="z-10 flex size-full flex-col justify-end gap-8 bg-black/75 p-8 text-background backdrop-blur-lg">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end">
            <div className="top-8 right-8 z-10 size-[160px] overflow-hidden rounded-lg opacity-25 md:relative md:top-0 md:right-0 md:h-[250px] md:w-[200px] md:opacity-100">
              {zone.cover_image_url && <Image fill objectFit="cover" src={zone.cover_image_url} alt="커버 이미지" />}
            </div>

            <div className="z-20 flex flex-col">
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

      <div className="col-span-2 lg:col-span-1">
        <div className="rounded-lg border px-8 py-6">
          <h3 className="mb-4 font-bold text-lg">좌석 선택</h3>

          <div className="relative w-full overflow-hidden rounded-lg">
            {zone.map_image_url && <Image src={zone.map_image_url} alt="구역 이미지" width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} />}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {data?.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSite(s)}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-lg border p-2 text-sm hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-25",
                  {
                    "border-primary bg-primary/20": site?.id === s.id,
                  },
                )}
                disabled={s.is_reserved}
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

        <div className="mt-6 rounded-lg border px-8 py-6">
          <h3 className="mb-4 font-bold text-lg">예약자 정보</h3>

          <div className="flex flex-col gap-4">
            <Input placeholder="이름" value={effectiveName} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="연락처" value={effectiveContact} onChange={(e) => setContact(e.target.value)} inputMode="numeric" />

            <div className="flex cursor-pointer items-center gap-2 rounded-md border pl-2 shadow-xs transition hover:bg-neutral-100">
              <Checkbox id="terms" className="transition" checked={terms} onCheckedChange={(c) => setTerms(c)} />
              <Label htmlFor="terms" className="block w-full py-2.5 text-secondary-foreground">
                <Dialog>
                  <DialogTrigger className="cursor-pointer text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                    시설 이용 방침
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>시설 이용 방침</DialogTitle>
                      <DialogDescription>
                        - 본 패키지는 취사 가능 패키지입니다
                        <br />- 정해진 입실, 퇴실 시간은 반드시 지켜주세요
                        <br />- 시설 내에서는 절대 금연입니다
                        <br />- 미성년자는 부모님 동행이 있어야만 입장 가능합니다
                        <br />- 반려동물은 입장을 금하오니 양해바랍니다
                        <br />- 음식물이나 기타쓰레기, 재활용품 등은 분리수거를 해주셔야 합니다.
                        <br />- 지나친 음무/가무/소란은 다른 분들의 휴식을 방해하므로 퇴장 조치 될 수 있는 점 양해 부탁드립니다
                        <br />- 시설 내 물품 및 설치물의 분실 및 훼손의 책임은 이용자에게 있으니 주의 부탁드립니다
                        <br />- 화약, 폭죽 등은 사용하실 수 없습니다
                        <br />- 화재로 인한 책임은 이용자에게 있습니다
                        <br />- 이용자의 귀중품 분실 시 그 책임은 이용자에게 있습니다
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                과{" "}
                <Dialog>
                  <DialogTrigger className="cursor-pointer text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                    개인정보 처리방침
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>개인정보 처리방침</DialogTitle>
                      <DialogDescription>
                        어썸월드는 개인정보보호법 등 관련 법률에 따라 개인정보 수집ㆍ이용 시 정보 주체에게 사전 고지하고 이에 대한 동의를 받습니다.
                        <br />
                        <br />
                        1. 개인정보의 수집ㆍ이용 목적
                        <br />- 수집ㆍ이용 목적 : 고객 문의 결과 회신
                        <br />- 수집ㆍ이용 방법 : 회사 홈페이지
                        <br />
                        <br />
                        2. 수집하려는 개인정보의 항목
                        <br />- 필수항목 : 성명, 연락처, 이메일주소, 회사명
                        <br />- 선택항목 : 없음
                        <br />
                        <br />
                        3. 보유 및 이용 기간
                        <br />- 어썸월드 개인정보 수집ㆍ이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만 관련 법률에 의해 보존의무가 있는 경우에는 법령이 지정한
                        일정기간 보존합니다.
                        <br />
                        <br />
                        4. 귀하는 귀하의 개인정보 수집·이용에 대한 동의를 거부하실 권리가 있으며, 동의하지 않더라도 고객문의를 하는데 제약은 없습니다.
                        <br />
                        <br />- 다만, 동의를 거부하실 경우 회사는 문의에 대한 결과를 회신하지 못하거나 적기에 처리하지 못할 수 있습니다.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                에 동의합니다.
              </Label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span>총 결제금액</span>
            <span className="font-bold text-2xl text-red-500">{(zone.price + zone.additional_person_price * additionalPerson).toLocaleString("ko-KR")}원</span>
          </div>

          <Button className="cursor-pointer py-6 transition" onClick={() => goPay()} disabled={!site || !effectiveName || !effectiveContact || !terms}>
            예약하기
          </Button>
        </div>
      </div>

      <div className="col-span-2 whitespace-pre-line rounded-lg border p-4">{zone.description}</div>

      <div className="hidden">
        <form id="tranMgr" name="tranMgr" method="post">
          <input type="hidden" readOnly name="PayMethod" defaultValue="CARD" />
          <input type="hidden" readOnly name="GoodsCnt" defaultValue="1" />
          <input type="hidden" readOnly name="GoodsName" value={`${dateString} ${zone.name}`} />
          <input type="hidden" readOnly name="Amt" value={zone.price + zone.additional_person_price * additionalPerson} />
          <input type="hidden" readOnly name="Moid" ref={moidRef} />
          <input type="hidden" readOnly name="Mid" defaultValue={mid} />
          <input type="hidden" readOnly name="ReturnUrl" defaultValue={returnUrl} />
          <input type="hidden" readOnly name="StopUrl" defaultValue={stopUrl} />
          <input type="hidden" readOnly name="BuyerName" value={effectiveName} />
          <input type="hidden" readOnly name="BuyerTel" value={effectiveContact} />
          <input type="hidden" readOnly name="BuyerEmail" defaultValue="" />
          <input type="hidden" readOnly name="VbankExpDate" defaultValue={format(addDays(new Date(), 1), "yyyyMMdd")} />
          <input type="hidden" readOnly name="EncryptData" ref={encDataRef} />
          <input type="hidden" readOnly name="GoodsCl" defaultValue="0" />
          <input type="hidden" readOnly name="EdiDate" defaultValue={ediDate} />
        </form>

        <form id="approvalForm" name="approvalForm" method="post">
          <input type="hidden" readOnly id="Tid" name="Tid" />
          <input type="hidden" readOnly id="TrAuthKey" name="TrAuthKey" />
        </form>
      </div>
    </div>
  );
}

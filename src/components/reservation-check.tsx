"use client";

import { format, isBefore } from "date-fns";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FetchState = "idle" | "loading" | "success" | "error";

type ReservationSearchResponse = Reservation[] | { reservations?: Reservation[]; data?: Reservation[] };

export default function ReservationCheck() {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [results, setResults] = useState<Reservation[] | null>(null);
  const [state, setState] = useState<FetchState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmedName = name.trim();
    const trimmedContact = contact.trim();

    if (!trimmedName || !trimmedContact) {
      setState("error");
      setErrorMessage("이름과 전화번호를 모두 입력해 주세요.");
      setResults(null);
      return;
    }

    setState("loading");
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/reservations?name=${encodeURIComponent(trimmedName)}&contact=${encodeURIComponent(trimmedContact)}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("예약 정보를 불러오지 못했습니다.");
      }

      const data = (await response.json()) as ReservationSearchResponse;
      const reservations = Array.isArray(data) ? data : (data.reservations ?? data.data ?? []);

      setResults(reservations);
      setState("success");
    } catch (error) {
      setState("error");
      setResults(null);
      setErrorMessage(error instanceof Error ? error.message : "예약 정보를 불러오지 못했습니다.");
    }
  };

  const cancelReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        const message = data?.error || "예약 취소에 실패했습니다.";
        toast.error(message);
      } else {
        await handleSubmit();
        const data = await response.json();
        const message = data?.message || "예약이 취소되었습니다.";
        toast.success(message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "예약 취소에 실패했습니다.");
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>예약 내역 조회</CardTitle>
          <CardDescription>예약 시 사용한 이름과 전화번호를 입력해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reservation-name">이름</Label>
              <Input id="reservation-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="홍길동" autoComplete="name" disabled={state === "loading"} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="reservation-contact">전화번호</Label>
              <Input
                id="reservation-contact"
                type="tel"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="01012345678"
                autoComplete="tel"
                disabled={state === "loading"}
              />
            </div>

            <Button type="submit" className="mt-2" disabled={state === "loading"}>
              {state === "loading" ? "조회 중..." : "예약 조회"}
            </Button>

            {state === "error" && errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}
          </form>
        </CardContent>
      </Card>

      {state === "loading" && <div className="mt-6 rounded-lg border px-6 py-4 text-center text-sm">예약 정보를 불러오는 중입니다.</div>}

      {state === "success" && results && results.length === 0 && <div className="mt-6 rounded-lg border px-6 py-4 text-center text-sm">일치하는 예약 내역이 없습니다.</div>}

      {state === "success" && results && results.length > 0 && (
        <div className="mt-6 space-y-4">
          {results.map((reservation) => (
            <Card key={reservation.id} className={cn("", { "opacity-50": reservation.canceled_at || isBefore(reservation.reservation_at, new Date()) })}>
              <CardHeader>
                <CardTitle>
                  {reservation.zone_name} {reservation.site_name}
                </CardTitle>
                <CardDescription>예약일시: {format(reservation.reservation_at, "yyyy-MM-dd")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">예약자</span>
                  <span>{reservation.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">연락처</span>
                  <span>{reservation.contact}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">이용일</span>
                  <span>{format(reservation.reservation_at, "yyyy-MM-dd")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">추가 인원</span>
                  <span>{reservation.additional_person}명</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">결제 금액</span>
                  <span>{reservation.price.toLocaleString("ko-KR")}원</span>
                </div>
                {reservation.canceled_at && (
                  <div className="flex items-center justify-between text-destructive">
                    <span>취소 일시</span>
                    <span>{format(new Date(reservation.canceled_at), "yyyy-MM-dd")}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {!reservation.canceled_at && isBefore(reservation.reservation_at, new Date()) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">예약 취소</Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>예약을 취소하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>예약 취소 시 환불 규정에 따라 처리됩니다.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>돌아가기</AlertDialogCancel>
                        <AlertDialogAction onClick={() => cancelReservation(reservation.id)}>예약 취소</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

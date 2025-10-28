"use client";

import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function Reservation() {
  const searchParams = useSearchParams();

  const { data: reservation } = useSWR<Reservation>(`/api/reservations/${searchParams.get("id")}`);

  if (!reservation) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-col gap-4 rounded border p-6">
      <span className="text-lg">
        예약 정보: {reservation.zone_name} {reservation.site_name}
      </span>
      <span className="text-lg">예약 일시: {format(reservation.reservation_at, "yyyy-MM-dd")}</span>
      <span className="text-lg">결제 금액: {reservation.price.toLocaleString("ko-KR")}원</span>
      <span className="text-muted-foreground">예약 취소 관련 문의는 고객센터로 문의 바랍니다</span>
    </div>
  );
}

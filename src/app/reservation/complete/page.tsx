import type { Metadata } from "next";
import ReservationComplete from "@/components/reservation-complete";

export const metadata: Metadata = {
  title: "예약 완료 안내",
  description: "캠핑장 실시간 예약 페이지입니다.",
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">실시간 예약</h1>
      </div>

      <div className="mx-auto max-w-4xl">
        <ReservationComplete />
      </div>
    </div>
  );
}

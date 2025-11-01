import type { Metadata } from "next";
import ReservationCheck from "@/components/reservation-check";

export const metadata: Metadata = {
  title: "예약 조회",
  description: "캠핑장 예약 내역을 조회합니다.",
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">예약 조회</h1>
      </div>

      <div className="mx-auto max-w-4xl">
        <ReservationCheck />
      </div>
    </div>
  );
}

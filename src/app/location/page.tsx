import type { Metadata } from "next";
import Link from "next/link";
import LocationView from "@/components/location-view";

export const metadata: Metadata = {
  title: "오시는 길",
  description: "캠핑장까지 오시는 길을 안내해 드립니다.",
};

export default function Page() {
  return (
    <div className="container py-8 lg:py-12 px-4 mx-auto">
      <div className="flex items-center flex-col justify-center mb-8">
        <h1 className="inline-block underline-offset-8 underline decoration-primary decoration-from-font font-bold text-3xl mb-4">오시는 길</h1>

        <span>캠핑장까지 오시는 길을 안내해 드립니다.</span>
      </div>

      <div className="flex flex-col items-stretch gap-4 max-w-4xl mx-auto">
        <div className="text-center rounded border p-4 flex flex-col gap-2">
          <h2 className="font-bold text-3xl">캠핑장명</h2>
          <span className="font-semibold">캠핑장 주소</span>

          <span className="font-semibold mt-2">
            연락처{" "}
            <Link href="tel:031-123-1234" className="font-normal">
              031-123-1234
            </Link>
          </span>
        </div>

        <LocationView />
      </div>
    </div>
  );
}

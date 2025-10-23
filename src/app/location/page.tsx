import type { Metadata } from "next";
import Link from "next/link";
import LocationView from "@/components/location-view";

export const metadata: Metadata = {
  title: "오시는 길",
  description: "캠핑장까지 오시는 길을 안내해 드립니다.",
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">오시는 길</h1>

        <span>캠핑장까지 오시는 길을 안내해 드립니다.</span>
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-stretch gap-4">
        <div className="flex flex-col gap-2 rounded border p-4 text-center">
          <h2 className="font-bold text-3xl">캠핑장명</h2>
          <span className="font-semibold">캠핑장 주소</span>

          <span className="mt-2 font-semibold">
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

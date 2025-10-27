import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "연락처",
  description: "캠핑장 연락처 안내입니다.",
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">연락처</h1>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-2 rounded border p-4 text-center">
          <h2 className="font-bold text-3xl">어썸월드 화성점</h2>
          <span className="font-semibold">경기도 화성시 남양읍 마도공단로 120-14</span>

          <span className="mt-2 font-semibold">
            연락처{" "}
            <Link href="tel:050-6889-8237" className="font-normal">
              050-6889-8237
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

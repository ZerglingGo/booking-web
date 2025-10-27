import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "캠핑장 소개",
  description: "우리 캠핑장을 소개합니다.",
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">캠핑장 소개</h1>

        <span>우리 캠핑장을 소개합니다.</span>
      </div>

      <div className="mx-auto max-w-4xl rounded bg-neutral-100 px-6 shadow"></div>
    </div>
  );
}

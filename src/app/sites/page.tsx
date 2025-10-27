import type { Metadata } from "next";
import ZoneTabs from "@/components/zone-tabs";

export const metadata: Metadata = {
  title: "시설 안내",
  description: "캠핑장 시설들을 안내해드립니다.",
};

export default async function Page() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">시설 안내</h1>

        <span>캠핑장 시설들을 안내해드립니다.</span>
      </div>

      <div className="mx-auto max-w-4xl px-6">
        <ZoneTabs />
      </div>
    </div>
  );
}

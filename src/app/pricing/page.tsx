import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "요금 안내",
  description: "캠핑장 이용 요금을 안내해드립니다.",
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">요금 안내</h1>

        <span>캠핑장 이용 요금을 안내해드립니다.</span>
      </div>

      <div className="mx-auto max-w-4xl rounded bg-neutral-100 px-6 shadow">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold text-lg">입장 시간 전에 미리 들어갈 수 있나요?</AccordionTrigger>
            <AccordionContent className="whitespace-pre-line">
              {
                "현장 준비가 어느 정도 완료된 상태라면 직원의 안내에 따라 입장 시간보다 조금 더 빨리 입장이 가능할 수 있습니다.\n단, 상황에 따라 변동 될 수 있다는 점 참고해주시면 감사하겠습니다.\n\n체크인 하시기 전, 자리에 짐을 먼저 옮기거나 먼저 입장하실 수는 없습니다."
              }
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

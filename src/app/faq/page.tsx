import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: "캠핑장 이용 시 자주 묻는 질문 사항들입니다.",
};

export default async function Page() {
  const data = await fetch(`${process.env.API_ENDPOINT}/api/questions`, { cache: "no-store" }).catch(() => null);
  const questions = await data?.json().catch(() => []);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">자주 묻는 질문</h1>

        <span>캠핑장 이용 시 자주 묻는 질문 사항들입니다.</span>
      </div>

      <div className="mx-auto max-w-4xl rounded bg-neutral-100 px-6 shadow">
        <Accordion type="single" collapsible>
          {!questions || questions.length === 0 ? (
            <div className="py-4 text-center text-lg">내용이 없습니다.</div>
          ) : (
            questions.map((question: Question) => (
              <AccordionItem key={question.id} value={`item-${question.id}`}>
                <AccordionTrigger className="font-semibold text-lg">{question.question}</AccordionTrigger>
                <AccordionContent className="whitespace-pre-line">{question.answer}</AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>
      </div>
    </div>
  );
}

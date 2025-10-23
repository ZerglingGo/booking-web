import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: { params: { notice_id: string } }): Promise<Metadata> {
  // TODO: cache
  const data = await fetch(`${process.env.API_ENDPOINT}/api/articles/${params.notice_id}`);
  const article = await data.json();

  return {
    title: article.title,
    description: article.content.slice(0, 100).replace(/\n/g, " "),
  };
}

export default async function Page({ params }: { params: { notice_id: string } }) {
  const data = await fetch(`${process.env.API_ENDPOINT}/api/articles/${params.notice_id}`);
  if (!data.ok) {
    redirect("/notices");
  }

  const article = await data.json();

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">공지사항</h1>

        <span>캠핑장에서 전해드리는 공지사항입니다.</span>
      </div>

      <div className="mx-auto max-w-4xl border-y px-6">
        <div className="flex flex-col border-b py-4 last:border-0">
          <div className="-mt-2 mb-4">
            <Link href="/notices" className="text-muted-foreground text-sm">
              &larr; 목록으로 돌아가기
            </Link>
          </div>

          <h2 className="mb-2 font-semibold text-2xl">{article.title}</h2>
          <div className="mb-6 text-muted-foreground text-sm">
            {new Date(article.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
          </div>

          <div className="whitespace-pre-wrap">{article.content}</div>
        </div>
      </div>
    </div>
  );
}

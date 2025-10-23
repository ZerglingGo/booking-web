import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "공지사항",
  description: "캠핑장에서 전해드리는 공지사항입니다.",
};

export default async function Page() {
  const data = await fetch(`${process.env.API_ENDPOINT}/api/articles?category=notice`).catch(() => null);
  const articles = await data?.json().catch(() => []);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">공지사항</h1>

        <span>캠핑장에서 전해드리는 공지사항입니다.</span>
      </div>

      <div className="mx-auto max-w-4xl border-y px-6">
        {articles.length === 0 ? (
          <div className="py-4 text-center text-lg">공지사항이 없습니다.</div>
        ) : (
          articles.map((article: Article) => (
            <div key={article.id} className="flex flex-col items-center justify-between border-b py-4 last:border-0 sm:flex-row">
              <div className="flex items-center justify-between gap-8">
                <span className="min-w-8 text-center">{article.id}</span>
                <Link href={`/notices/${article.id}`} className="font-semibold text-lg">
                  {article.title}
                </Link>
              </div>
              <div className="text-muted-foreground text-sm">{new Date(article.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

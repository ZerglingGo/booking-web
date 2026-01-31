import { ClockIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const data = await fetch(`${process.env.API_ENDPOINT}/api/articles?category=notice`, { cache: "no-store" }).catch(() => null);
  const articles = await data?.json().catch(() => []);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">환영합니다!</h1>

        <span>어썸월드 화성점에 오신 것을 환영합니다.</span>
      </div>

      <div className="mx-auto max-w-4xl">
        <h2 className="font-extrabold text-3xl tracking-tight">공지사항</h2>

        <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {!articles || articles.length === 0 ? (
            <div className="rounded-lg border py-4 text-center">공지사항이 없습니다.</div>
          ) : (
            articles.slice(0, 8).map((article: Article) => (
              <Link href={`/notices/${article.id}`} key={article.id}>
                {article.image_url && <Image src={article.image_url} width={0} height={0} sizes="100vw" className="mb-4 h-auto w-full rounded-lg" alt={article.title} />}

                <div className="flex items-center justify-between gap-8">
                  <span className="font-semibold text-lg">{article.title}</span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <ClockIcon size={14} /> {new Date(article.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

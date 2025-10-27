import Image from "next/image";
import Link from "next/link";

export default async function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-center border-primary border-t-2 bg-white">
      <div className="container px-4 py-8 lg:py-12">
        <Image src="/icon.png" alt="logo" width={64} height={64} priority className="mx-auto lg:mx-0" />

        <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row">
          <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-secondary-foreground lg:mx-0 lg:justify-start">
            <div>어썸월드 화성점</div>
            <div>대표 신명호, 최승우</div>
            <div>개인정보관리책임자 신명호, 최승우</div>
            <div>연락처: 050-6889-8237</div>
            <div>경기도 화성시 남양읍 마도공단로 120-14</div>
            <div>사업자등록번호: 216-88-03406</div>
            <div>통신판매업신고번호: 제2024-화성남양-0349호</div>
          </div>

          <div className="flex items-start justify-center gap-x-6 gap-y-2 text-secondary-foreground">
            <Link href="/tos">이용약관</Link>
            <Link href="/privacy">개인정보처리방침</Link>
          </div>
        </div>
      </div>

      <div className="w-full border-t py-2 text-center">
        <span className="text-muted-foreground text-xs">&copy; 2025 Awesomeworld. All rights reserved.</span>
      </div>
    </footer>
  );
}

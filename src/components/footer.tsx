import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-center border-primary border-t-2 bg-white">
      <div className="container px-4 py-8 lg:py-12">
        <Image src="https://placehold.co/180x60.png" alt="logo" width={180} height={60} priority className="mx-auto grayscale lg:mx-0" />

        <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row">
          <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-secondary-foreground lg:mx-0 lg:justify-start">
            <div>캠핑장명</div>
            <div>대표 홍길동</div>
            <div>개인정보관리책임자 홍길동</div>
            <div>연락처: 000-0000-0000</div>
            <div>경기도 화성시 반송동</div>
            <div>사업자등록번호: 000-00-00000</div>
            <div>통신판매업신고번호: 제2025-서울강남-00000호</div>
          </div>

          <div className="flex items-start justify-center gap-x-6 gap-y-2 text-secondary-foreground">
            <Link href="/">이용약관</Link>
            <Link href="/">개인정보처리방침</Link>
          </div>
        </div>
      </div>

      <div className="w-full border-t py-2 text-center">
        <span className="text-muted-foreground text-xs">&copy; 2025 캠핑장명. All rights reserved.</span>
      </div>
    </footer>
  );
}

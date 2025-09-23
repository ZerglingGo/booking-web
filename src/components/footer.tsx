import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center border-t-2 border-primary w-full bg-white">
      <div className="container py-8 lg:py-12 px-4">
        <Image src="https://placehold.co/180x60.png" alt="logo" width={180} height={60} priority className="grayscale mx-auto lg:mx-0" />

        <div className="mt-4 justify-between flex lg:flex-row flex-col gap-4">
          <div className="text-secondary-foreground max-w-xl flex flex-wrap justify-center mx-auto lg:mx-0 lg:justify-start items-center gap-x-6 gap-y-2">
            <div>캠핑장명</div>
            <div>대표 홍길동</div>
            <div>개인정보관리책임자 홍길동</div>
            <div>연락처: 000-0000-0000</div>
            <div>경기도 화성시 반송동</div>
            <div>사업자등록번호: 000-00-00000</div>
            <div>통신판매업신고번호: 제2025-서울강남-00000호</div>
          </div>

          <div className="text-secondary-foreground flex justify-center items-start gap-x-6 gap-y-2">
            <Link href="/">이용약관</Link>
            <Link href="/">개인정보처리방침</Link>
          </div>
        </div>
      </div>

      <div className="border-t w-full text-center py-2">
        <span className="text-muted-foreground text-xs">&copy; 2025 캠핑장명. All rights reserved.</span>
      </div>
    </footer>
  );
}

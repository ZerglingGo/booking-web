import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { SWRProvider } from "@/lib/swr-provider";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - 어썸월드 화성점",
    default: "어썸월드 화성점",
  },
  description: "캠핑장 소개",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} antialiased`}>
        <SWRProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </SWRProvider>
      </body>
    </html>
  );
}

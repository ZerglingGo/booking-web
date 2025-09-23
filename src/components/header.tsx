"use client";

import Image from "next/image";
import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center py-2 gap-4 border-b shadow sticky w-full top-0 bg-white z-10">
      <Link href="/">
        <Image src="https://placehold.co/180x60.png" alt="logo" width={180} height={60} priority />
        <span className="sr-only">title</span>
      </Link>

      <Navigation />
    </header>
  );
}

function Navigation() {
  return (
    <NavigationMenu viewport={false} delayDuration={0}>
      <NavigationMenuList className="gap-4">
        <NavigationMenuItem>
          <NavigationMenuLink href="/">
            <span className="font-bold text-lg">홈</span>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="/booking">
            <span className="font-bold text-lg">실시간 예약</span>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <span className="font-bold text-lg">시설 안내</span>
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <div className="grid gap-2 lg:w-[400px] lg:grid-cols-[.75fr_1fr]">
              <div className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/introduce"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">캠핑장명</div>
                    <p className="text-muted-foreground text-sm leading-tight">캠핑장 소개</p>
                  </Link>
                </NavigationMenuLink>
              </div>

              <NavigationMenuLink asChild>
                <Link href="/sites">
                  <div className="text-sm leading-none font-medium">시설 안내</div>
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">캠핑장 시설 안내</p>
                </Link>
              </NavigationMenuLink>

              <NavigationMenuLink asChild>
                <Link href="/pricing">
                  <div className="text-sm leading-none font-medium">요금 안내</div>
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">캠핑장 이용 요금 안내</p>
                </Link>
              </NavigationMenuLink>

              <NavigationMenuLink asChild>
                <Link href="/location">
                  <div className="text-sm leading-none font-medium">오시는 길</div>
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">캠핑장까지 오시는 길</p>
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <span className="font-bold text-lg">고객센터</span>
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <div className="grid w-[120px] gap-2">
              <NavigationMenuLink href="/notices">
                <span className="font-semibold">공지사항</span>
              </NavigationMenuLink>

              <NavigationMenuLink href="/faq">
                <span className="font-semibold">자주 묻는 질문</span>
              </NavigationMenuLink>

              <NavigationMenuLink href="/contact">
                <span className="font-semibold">연락처</span>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

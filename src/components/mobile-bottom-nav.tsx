"use client";

import { CalendarIcon, CheckCircleIcon, HomeIcon, LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";

export default function MobileBottomNav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading, logout } = useAuth();

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:hidden">
      <nav className="grid grid-cols-5">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button type="button" className="flex flex-col items-center justify-center gap-1 py-2 font-medium text-muted-foreground text-xs">
              <MenuIcon className="size-5" />
              전체메뉴
            </button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>메뉴</SheetTitle>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-2 px-4 font-bold text-xl tracking-tight">
              <div className="flex flex-col gap-2 px-1">
                <Link onClick={handleClose} href="/">
                  홈
                </Link>
                <Link onClick={handleClose} href="/reservation">
                  실시간 예약
                </Link>
                <Link onClick={handleClose} href="/reservation/check">
                  예약 조회
                </Link>
              </div>

              <Separator className="my-2" />

              <div className="flex flex-col gap-2 px-1">
                <span className="font-normal text-neutral-500 text-sm">캠핑장 소개</span>
                <Link onClick={handleClose} href="/sites">
                  시설 안내
                </Link>
                <Link onClick={handleClose} href="/pricing">
                  요금 안내
                </Link>
                <Link onClick={handleClose} href="/location">
                  오시는 길
                </Link>
              </div>

              <Separator className="my-2" />

              <div className="flex flex-col gap-2 px-1">
                <span className="font-normal text-neutral-500 text-sm">고객센터</span>
                <Link onClick={handleClose} href="/notices">
                  공지사항
                </Link>
                <Link onClick={handleClose} href="/faq">
                  자주 묻는 질문
                </Link>
                <Link onClick={handleClose} href="/contact">
                  연락처
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <NavLink href="/" label="홈" icon={<HomeIcon className="size-5" />} />
        <NavLink href="/reservation" label="실시간예약" icon={<CalendarIcon className="size-5" />} />
        <NavLink href="/reservation/check" label="예약확인" icon={<CheckCircleIcon className="size-5" />} />
        {isLoading ? (
          <NavPlaceholder label="" />
        ) : isAuthenticated ? (
          <NavButton onClick={handleLogout} label="로그아웃" icon={<LogOutIcon className="size-5" />} />
        ) : (
          <NavLink href="/auth/login" label="로그인" icon={<LogInIcon className="size-5" />} />
        )}
      </nav>
    </div>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-1 py-2 font-medium text-muted-foreground text-xs">
      {icon}
      {label}
    </Link>
  );
}

function NavButton({ label, icon, onClick }: { label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center justify-center gap-1 py-2 font-medium text-muted-foreground text-xs">
      {icon}
      {label}
    </button>
  );
}

function NavPlaceholder({ label }: { label: string }) {
  return <div className="flex flex-col items-center justify-center gap-1 py-2 text-transparent text-xs">{label}</div>;
}

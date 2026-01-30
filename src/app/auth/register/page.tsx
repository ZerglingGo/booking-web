"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

export default function Page() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedContact = contact.trim();
    const trimmedPassword = password.trim();
    const trimmedPasswordConfirmation = passwordConfirmation.trim();

    if (!trimmedName || !trimmedEmail || !trimmedContact || !trimmedPassword || !trimmedPasswordConfirmation) {
      toast.error("모든 항목을 입력해 주세요.");
      return;
    }

    if (trimmedPassword !== trimmedPasswordConfirmation) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const result = await register({
      name: trimmedName,
      email: trimmedEmail,
      contact: trimmedContact,
      password: trimmedPassword,
      passwordConfirmation: trimmedPasswordConfirmation,
      deviceName: "web",
    });

    setLoading(false);

    if (!result.ok) {
      toast.error(result.message ?? "회원가입에 실패했습니다.");
      return;
    }

    toast.success("회원가입이 완료되었습니다.");
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>회원가입</CardTitle>
            <CardDescription>회원 정보를 입력해 주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="register-name">이름</Label>
                <Input id="register-name" value={name} onChange={(event) => setName(event.target.value)} disabled={loading} placeholder="이름" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="register-email">이메일</Label>
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  placeholder="example@email.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="register-contact">연락처</Label>
                <Input
                  id="register-contact"
                  type="tel"
                  autoComplete="tel"
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  disabled={loading}
                  placeholder="01012345678"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="register-password">비밀번호</Label>
                <Input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  placeholder="비밀번호"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="register-password-confirmation">비밀번호 확인</Label>
                <Input
                  id="register-password-confirmation"
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirmation}
                  onChange={(event) => setPasswordConfirmation(event.target.value)}
                  disabled={loading}
                  placeholder="비밀번호 확인"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "가입 중..." : "회원가입"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex items-center justify-between text-muted-foreground text-sm">
            <span>이미 계정이 있으신가요?</span>
            <Link href="/auth/login" className="font-semibold text-primary hover:underline">
              로그인
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

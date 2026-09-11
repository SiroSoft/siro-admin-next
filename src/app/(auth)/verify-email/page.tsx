"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

type VerifyEmailForm = z.infer<typeof verifyEmailSchema>;

function VerifyEmailFormInner() {
  const { t } = useI18n();
  const { user, refetchSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryToken = searchParams.get("token") ?? "";
  const [isPending, setIsPending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);

  const isAlreadyVerified = !!user?.email_verified_at;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailForm>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token: queryToken },
  });

  const onSubmit = async (data: VerifyEmailForm) => {
    setIsPending(true);
    try {
      await authService.verifyEmail(data);
      setVerified(true);
      await refetchSession();
      setTimeout(() => router.push("/"), 1500);
    } catch {
      toast({ title: t("verifyEmail.invalidToken"), variant: "destructive" });
    } finally {
      setIsPending(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authService.resendVerificationEmail();
      toast({ title: t("profile.verificationSent"), variant: "success" });
    } catch {
      toast({ title: t("errors.networkError"), variant: "destructive" });
    } finally {
      setIsResending(false);
    }
  };

  if (verified) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-2" />
          <CardTitle>{t("verifyEmail.success")}</CardTitle>
          <CardDescription>{t("verifyEmail.success")}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/">
            <Button>{t("common.dashboard")}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>{t("verifyEmail.title")}</CardTitle>
        <CardDescription>{t("verifyEmail.title")}</CardDescription>
        {isAlreadyVerified && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-sm text-emerald-600 font-medium">{t("profile.emailVerified")}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAlreadyVerified && user && (
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span className="text-sm text-amber-700 dark:text-amber-400">{t("profile.emailNotVerified")}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">{t("verifyEmail.token")}</Label>
            <Input id="token" {...register("token")} placeholder={t("verifyEmail.tokenPlaceholder")} />
            {errors.token && <p className="text-sm text-destructive">{errors.token.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending || isAlreadyVerified}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("verifyEmail.submit")}
          </Button>
        </form>
        {!isAlreadyVerified && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isResending}
            onClick={handleResend}
          >
            {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("profile.resendVerification")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Card className="shadow-lg"><CardContent className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></CardContent></Card>}>
      <VerifyEmailFormInner />
    </Suspense>
  );
}

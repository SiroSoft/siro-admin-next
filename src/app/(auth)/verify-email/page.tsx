"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

type VerifyEmailForm = z.infer<typeof verifyEmailSchema>;

function VerifyEmailFormInner() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const queryToken = searchParams.get("token") ?? "";
  const [isPending, setIsPending] = useState(false);
  const [verified, setVerified] = useState(false);

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
    } catch (e: any) {
      toast({ title: t("verifyEmail.invalidToken"), variant: "destructive" });
    } finally {
      setIsPending(false);
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
          <Link href="/login">
            <Button>{t("common.login")}</Button>
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Token</Label>
            <Input id="token" {...register("token")} placeholder="Enter verification token" />
            {errors.token && <p className="text-sm text-destructive">{errors.token.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("verifyEmail.submit")}
          </Button>
        </form>
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

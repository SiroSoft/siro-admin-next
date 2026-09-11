"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { tSchema } from "@/lib/i18n";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service"; import { Turnstile } from "@marsidev/react-turnstile";

const schema = z.object({
  email: z.string().email(tSchema("validation.invalidEmail")),
});

type Form = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""; const [turnstileToken, setTurnstileToken] = useState(""); const onSubmit = async (data: Form) => { setIsPending(true); try { await authService.forgotPassword(data.email, turnstileToken || undefined);
      setSent(true);
    } catch (e) {
      toast({ title: t("errors.unknown"), description: (e as Error).message || t("errors.networkError"), variant: "destructive" });
    } finally {
      setIsPending(false);
    }
  };

  if (sent) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-2" />
          <CardTitle>{t("common.confirm")}</CardTitle>
          <CardDescription>{t("forgotPassword.sentMessage")}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/login">
            <Button variant="link">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")} {t("common.login")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>{t("auth.forgotPassword")}</CardTitle>
        <CardDescription>{t("forgotPassword.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input id="email" type="email" placeholder={t("forgotPassword.emailPlaceholder")} {...register("email")} disabled={isPending} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          {turnstileSiteKey !== "" && ( <Turnstile siteKey={turnstileSiteKey} onSuccess={(token) => setTurnstileToken(token)} onExpire={() => setTurnstileToken("")} onError={() => setTurnstileToken("")} /> )} <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? t("common.loading") : t("common.submit")}
          </Button>
          <div className="text-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
              {t("common.back")} {t("common.login")}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

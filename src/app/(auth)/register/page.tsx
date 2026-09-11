"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import { Turnstile } from "@marsidev/react-turnstile";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", password_confirmation: "" },
  });

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const [turnstileToken, setTurnstileToken] = useState("");

  const onSubmit = async (data: RegisterForm) => {
    setIsPending(true);
    setServerError(null);
    try {
      await authService.register({ ...data, ...(turnstileToken ? { "cf-turnstile-response": turnstileToken } : {}) });
      toast({ title: t("register.success"), variant: "success" });
      router.push("/login");
    } catch (e: any) {
      setServerError(e?.response?.data?.message || t("errors.unknown"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-4 text-center">
        <img src="/logo.svg" alt="Siro Admin" className="mx-auto h-12 w-12" />
        <div>
          <CardTitle className="text-2xl font-bold">{t("register.title")}</CardTitle>
          <CardDescription>{t("auth.signUp")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("register.name")} <span className="text-destructive">*</span></Label>
            <Input id="name" placeholder={t("register.namePlaceholder")} {...register("name")} autoComplete="name" autoFocus />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")} <span className="text-destructive">*</span></Label>
            <Input id="email" type="email" placeholder={t("login.emailPlaceholder")} {...register("email")} autoComplete="email" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password")} <span className="text-destructive">*</span></Label>
            <Input id="password" type="password" placeholder={t("login.passwordPlaceholder")} {...register("password")} autoComplete="new-password" />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">{t("validation.passwordMismatch")} <span className="text-destructive">*</span></Label>
            <Input id="password_confirmation" type="password" placeholder={t("login.passwordPlaceholder")} {...register("password_confirmation")} autoComplete="new-password" />
            {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>}
          </div>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          {turnstileSiteKey !== "" && (
            <Turnstile
              siteKey={turnstileSiteKey}
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken("")}
              onError={() => setTurnstileToken("")}
            />
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("register.submit")}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {t("register.haveAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline">{t("register.loginHere")}</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

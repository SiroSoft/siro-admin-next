"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; import { OpenSourceLinks } from "@/components/open-source-links";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/providers/i18n-provider";
import { APP_NAME } from "@/lib/constants";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const REMEMBER_EMAIL_KEY = "siro_remember_email";

export default function LoginPage() {
  const { login, isLoginPending, loginError, isLoading: isAuthLoading } = useAuth();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (savedEmail) {
      setValue("email", savedEmail);
      setRemember(true);
    }
  }, [setValue]);

  const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@skeleton.sirophp.com"; const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "Demo123!"; const demoEnabled = process.env.NEXT_PUBLIC_DEMO_ENABLED !== "false"; const onDemoLogin = () => { login({ email: demoEmail, password: demoPassword }); }; const onSubmit = (data: LoginForm) => {
    if (remember) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, data.email);
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }
    login(data);
  };

return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-4 text-center">
        <img src="/logo.svg" alt="Siro Admin" className="mx-auto h-12 w-12" />
        <div>
          <CardTitle className="text-2xl font-bold">{APP_NAME}</CardTitle>
          <CardDescription>{t("auth.signIn")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")} <span className="text-destructive">*</span></Label>
            <Input
              id="email"
              type="email"
              placeholder={t("login.emailPlaceholder")}
              {...register("email")}
              autoComplete="email"
              autoFocus
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password")} <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("login.passwordPlaceholder")}
                {...register("password")}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {loginError && (
            <p className="text-sm text-destructive">
              {(loginError as AxiosError<{ message?: string }>)?.response?.data?.message || t("login.invalidCredentials")}
            </p>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={remember}
                onCheckedChange={(v) => setRemember(v === true)}
              />
              {t("auth.rememberMe")}
            </label>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">{t("auth.forgotPassword")}</Link>
          </div>

          {demoEnabled && ( <Button type="button" variant="outline" className="w-full" onClick={onDemoLogin} disabled={isLoginPending}> Try live demo - 1 click </Button> )} <Button type="submit" className="w-full" disabled={isLoginPending}>
            {isLoginPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.login")}
          </Button>
          <div className="mt-4"><OpenSourceLinks /></div> <p className="text-sm text-center text-muted-foreground mt-4">
            {t("auth.noAccount")}{' '}
            <Link href="/register" className="text-primary hover:underline">{t("auth.signUp")}</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

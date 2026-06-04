"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormInner() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsPending(true);
    setServerError(null);
    try {
      await authService.resetPassword({ token, ...data });
      toast({ title: t("resetPassword.success"), variant: "success" });
      router.push("/login");
    } catch (e: any) {
      setServerError(e?.response?.data?.message || t("resetPassword.invalidToken"));
    } finally {
      setIsPending(false);
    }
  };

  if (!token) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>{t("resetPassword.invalidToken")}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/forgot-password">
            <Button variant="link">{t("auth.forgotPassword")}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>{t("resetPassword.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <input type="hidden" value={token} readOnly />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password")} <span className="text-destructive">*</span></Label>
            <Input id="password" type="password" {...register("password")} autoComplete="new-password" />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">{t("validation.passwordMismatch")} <span className="text-destructive">*</span></Label>
            <Input id="password_confirmation" type="password" {...register("password_confirmation")} autoComplete="new-password" />
            {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>}
          </div>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("resetPassword.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Card className="shadow-lg"><CardContent className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></CardContent></Card>}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}

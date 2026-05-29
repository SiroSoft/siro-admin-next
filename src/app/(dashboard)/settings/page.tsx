"use client";

import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sun, Moon, Monitor, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { useUpdateProfile, useChangePassword } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { API_URL, APP_NAME } from "@/lib/constants";
import { useState } from "react";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8),
  new_password_confirmation: z.string(),
}).refine((d) => d.new_password === d.new_password_confirmation, {
  message: "Passwords do not match",
  path: ["new_password_confirmation"],
});

const settingsSchema = z.object({
  app_name: z.string().optional(),
  app_description: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  pagination_per_page: z.coerce.number().optional(),
  maintenance_mode: z.boolean().optional(),
  email_notifications: z.boolean().optional(),
});

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "", email: user?.email ?? "" },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", new_password: "", new_password_confirmation: "" },
  });

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your application settings" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your name and email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit((d) => updateProfile.mutate(d))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="s-name">Name</Label>
                <Input id="s-name" {...profileForm.register("name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-email">Email</Label>
                <Input id="s-email" type="email" {...profileForm.register("email")} />
              </div>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit((d) => changePassword.mutate(d, { onSuccess: () => passwordForm.reset() }))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="s-current">Current Password</Label>
                <Input id="s-current" type="password" {...passwordForm.register("current_password")} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="s-new">New Password</Label>
                <Input id="s-new" type="password" {...passwordForm.register("new_password")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-confirm">Confirm Password</Label>
                <Input id="s-confirm" type="password" {...passwordForm.register("new_password_confirmation")} />
                {passwordForm.formState.errors.new_password_confirmation && (
                  <p className="text-sm text-destructive">{passwordForm.formState.errors.new_password_confirmation.message}</p>
                )}
              </div>
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Choose your preferred appearance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = theme === opt.value;
                return (
                  <Button
                    key={opt.value}
                    variant={isActive ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setTheme(opt.value)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {opt.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>Configure application preferences</CardDescription>
          </CardHeader>
          <CardContent>
            {settingsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (settings) {
                    const formData = new FormData(e.currentTarget);
                    updateSettings.mutate({
                      app_name: formData.get("app_name") as string,
                      app_description: formData.get("app_description") as string,
                      language: formData.get("language") as string,
                      timezone: formData.get("timezone") as string,
                      currency: formData.get("currency") as string,
                      pagination_per_page: Number(formData.get("pagination_per_page")),
                    });
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="app_name">App Name</Label>
                  <Input id="app_name" name="app_name" defaultValue={settings?.app_name ?? APP_NAME} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app_description">Description</Label>
                  <Input id="app_description" name="app_description" defaultValue={settings?.app_description ?? ""} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input id="language" name="language" defaultValue={settings?.language ?? "en"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" name="timezone" defaultValue={settings?.timezone ?? "UTC"} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" name="currency" defaultValue={settings?.currency ?? "USD"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pagination_per_page">Items Per Page</Label>
                    <Input id="pagination_per_page" name="pagination_per_page" type="number" defaultValue={settings?.pagination_per_page ?? 15} />
                  </div>
                </div>
                <Button type="submit" disabled={updateSettings.isPending}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Settings
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>API Information</CardTitle>
            <CardDescription>Connection details for the API backend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">API URL</p>
                <p className="text-sm font-mono">{API_URL}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">App Name</p>
                <p className="text-sm font-medium">{APP_NAME}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Environment</p>
                <p className="text-sm font-medium">{process.env.NODE_ENV}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sun, Moon, Monitor, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { useUpdateProfile, useChangePassword } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { API_URL, APP_NAME } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useCallback } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(8, "Password must be at least 8 characters"),
  new_password_confirmation: z.string(),
}).refine((d) => d.new_password === d.new_password_confirmation, {
  message: "Passwords do not match",
  path: ["new_password_confirmation"],
});

const settingsSchema = z.object({
  app_name: z.string().min(1, "App name is required"),
  app_description: z.string().optional(),
  language: z.string().min(1),
  timezone: z.string().min(1),
  currency: z.string().min(1),
  pagination_per_page: z.coerce.number().min(1).max(100),
  maintenance_mode: z.boolean(),
  email_notifications: z.boolean(),
});

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "vi", label: "Vietnamese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
];

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Ho_Chi_Minh",
  "Asia/Singapore",
  "Asia/Seoul",
  "Asia/Dubai",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "VND", label: "VND - Vietnamese Dong" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "KRW", label: "KRW - Korean Won" },
  { value: "SGD", label: "SGD - Singapore Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "BRL", label: "BRL - Brazilian Real" },
];

type SettingsFormData = z.infer<typeof settingsSchema>;

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

  const settingsForm = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    values: {
      app_name: settings?.app_name ?? APP_NAME,
      app_description: settings?.app_description ?? "",
      language: settings?.language ?? "en",
      timezone: settings?.timezone ?? "UTC",
      currency: settings?.currency ?? "USD",
      pagination_per_page: settings?.pagination_per_page ?? 15,
      maintenance_mode: settings?.maintenance_mode ?? false,
      email_notifications: settings?.email_notifications ?? true,
    },
  });

  const [pendingMaintenanceValue, setPendingMaintenanceValue] = useState<boolean | null>(null);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);

  const handleSettingsSubmit = (data: SettingsFormData) => {
    updateSettings.mutate(data, {
      onSuccess: () => {
        toast({ title: "Settings saved", description: "Application settings have been updated.", variant: "success" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
      },
    });
  };

  const handleMaintenanceToggle = useCallback((checked: boolean) => {
    setPendingMaintenanceValue(checked);
    if (checked) {
      setShowMaintenanceConfirm(true);
    } else {
      settingsForm.setValue("maintenance_mode", false);
    }
  }, [settingsForm]);

  const confirmMaintenance = useCallback(() => {
    if (pendingMaintenanceValue !== null) {
      settingsForm.setValue("maintenance_mode", pendingMaintenanceValue);
    }
    setShowMaintenanceConfirm(false);
    setPendingMaintenanceValue(null);
  }, [pendingMaintenanceValue, settingsForm]);

  const handleProfileSubmit = (data: { name: string; email: string }) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        toast({ title: "Profile updated", description: "Your profile has been updated.", variant: "success" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
      },
    });
  };

  const handlePasswordSubmit = (data: { current_password: string; new_password: string; new_password_confirmation: string }) => {
    changePassword.mutate(data, {
      onSuccess: () => {
        passwordForm.reset();
        toast({ title: "Password changed", description: "Your password has been changed.", variant: "success" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to change password.", variant: "destructive" });
      },
    });
  };

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
            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="s-name">Name</Label>
                <Input id="s-name" {...profileForm.register("name")} disabled={updateProfile.isPending} />
                {profileForm.formState.errors.name && (
                  <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-email">Email</Label>
                <Input id="s-email" type="email" {...profileForm.register("email")} disabled={updateProfile.isPending} />
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{profileForm.formState.errors.email.message}</p>
                )}
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
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="s-current">Current Password</Label>
                <Input id="s-current" type="password" {...passwordForm.register("current_password")} disabled={changePassword.isPending} />
                {passwordForm.formState.errors.current_password && (
                  <p className="text-sm text-destructive">{passwordForm.formState.errors.current_password.message}</p>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="s-new">New Password</Label>
                <Input id="s-new" type="password" {...passwordForm.register("new_password")} disabled={changePassword.isPending} />
                {passwordForm.formState.errors.new_password && (
                  <p className="text-sm text-destructive">{passwordForm.formState.errors.new_password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-confirm">Confirm Password</Label>
                <Input id="s-confirm" type="password" {...passwordForm.register("new_password_confirmation")} disabled={changePassword.isPending} />
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
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <form onSubmit={settingsForm.handleSubmit(handleSettingsSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app_name">App Name</Label>
                  <Input id="app_name" {...settingsForm.register("app_name")} disabled={updateSettings.isPending} />
                  {settingsForm.formState.errors.app_name && (
                    <p className="text-sm text-destructive">{settingsForm.formState.errors.app_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app_description">Description</Label>
                  <Input id="app_description" {...settingsForm.register("app_description")} disabled={updateSettings.isPending} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={settingsForm.watch("language")}
                      onValueChange={(v) => settingsForm.setValue("language", v)}
                      disabled={updateSettings.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={settingsForm.watch("timezone")}
                      onValueChange={(v) => settingsForm.setValue("timezone", v)}
                      disabled={updateSettings.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={settingsForm.watch("currency")}
                      onValueChange={(v) => settingsForm.setValue("currency", v)}
                      disabled={updateSettings.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pagination_per_page">Items Per Page</Label>
                    <Input id="pagination_per_page" type="number" {...settingsForm.register("pagination_per_page")} disabled={updateSettings.isPending} />
                    {settingsForm.formState.errors.pagination_per_page && (
                      <p className="text-sm text-destructive">{settingsForm.formState.errors.pagination_per_page.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="maintenance_mode"
                      checked={settingsForm.watch("maintenance_mode")}
                      onCheckedChange={handleMaintenanceToggle}
                      disabled={updateSettings.isPending}
                    />
                    <Label htmlFor="maintenance_mode" className="flex items-center gap-1">
                      Maintenance Mode
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="email_notifications"
                      checked={settingsForm.watch("email_notifications")}
                      onCheckedChange={(v) => settingsForm.setValue("email_notifications", v)}
                      disabled={updateSettings.isPending}
                    />
                    <Label htmlFor="email_notifications">Email Notifications</Label>
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

        <AlertDialog open={showMaintenanceConfirm} onOpenChange={setShowMaintenanceConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Enable Maintenance Mode?</AlertDialogTitle>
              <AlertDialogDescription>
                This will make the application inaccessible to users. Only administrators will be able to access the site. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmMaintenance}>Enable Maintenance Mode</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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

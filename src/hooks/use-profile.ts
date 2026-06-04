"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { useAuthStore } from "@/store/auth.store";
import type { components } from "@/types/api";
import { toast } from "@/hooks/use-toast";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: components["schemas"]["UpdateProfileRequest"]) => profileService.update(data),
    onSuccess: (user) => {
      setUser(user ?? null);
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      toast({ title: "Profile updated", description: "Your profile has been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: components["schemas"]["ChangePasswordRequest"]) => profileService.changePassword(data),
    onSuccess: () => {
      toast({ title: "Password changed", description: "Your password has been changed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to change password.", variant: "destructive" });
    },
  });
}

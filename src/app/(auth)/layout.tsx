export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-muted/50 px-4">
      <div className="w-full max-w-md animate-fade-in">{children}</div>
    </div>
  );
}

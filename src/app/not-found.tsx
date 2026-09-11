'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// NOTE: rendered outside I18nProvider during static prerender — keep static English.
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Button asChild><Link href="/">Go home</Link></Button>
    </div>
  )
}

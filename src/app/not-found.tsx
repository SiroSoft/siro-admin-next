'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">{t('common.pageNotFound')}</p>
      <Button asChild><Link href="/">{t('common.goHome')}</Link></Button>
    </div>
  )
}

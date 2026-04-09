'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { label: 'All', href: '/' },
  { label: 'Skincare', href: '/category/skincare' },
  { label: 'Makeup', href: '/category/makeup' },
] as const

export function CategoryTabs() {
  const pathname = usePathname()

  return (
    <div className="flex gap-2" role="tablist" aria-label="Browse by category">
      {TABS.map(({ label, href }) => {
        const isActive =
          href === '/' ? pathname === '/' : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={`cursor-pointer border-2 px-5 py-2 text-sm font-bold transition-all duration-150 ${
              isActive
                ? 'border-glow-black bg-glow-black text-white'
                : 'border-glow-black bg-white text-glow-black hover:bg-glow-primary hover:text-white hover:border-glow-primary'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}

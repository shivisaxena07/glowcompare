'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, X } from 'lucide-react'

interface SearchResult {
  id: string
  name: string
  brand: string
  category: string
  image_url: string
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    setLoading(true)
    fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}&limit=5`)
      .then((res) => res.json())
      .then(({ products }) => {
        setResults(products ?? [])
        setOpen(true)
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(id: string) {
    setQuery('')
    setOpen(false)
    router.push(`/products/${id}`)
  }

  function clearSearch() {
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <div className="flex items-center border-2 border-glow-black bg-white px-3 py-2 transition-colors duration-150 focus-within:border-glow-pink">
        <Search className="h-4 w-4 shrink-0 text-glow-black" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products or brands..."
          className="ml-2 flex-1 bg-transparent text-sm font-medium text-glow-black outline-none placeholder:font-normal placeholder:text-stone-400"
        />
        {query && (
          <button onClick={clearSearch} aria-label="Clear search" className="ml-1 shrink-0">
            <X className="h-3.5 w-3.5 text-stone-400 hover:text-stone-600" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 border-2 border-glow-black bg-white shadow-[4px_4px_0px_#0F172A]">
          {loading && (
            <p className="px-4 py-3 text-sm font-medium text-stone-400">Searching…</p>
          )}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm font-medium text-stone-400">No results found</p>
          )}
          {!loading && results.length > 0 && (
            <ul>
              {results.map((r) => (
                <li key={r.id} className="border-b border-stone-100 last:border-0">
                  <button
                    onClick={() => handleSelect(r.id)}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 hover:bg-glow-primary"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-stone-200 bg-stone-100">
                      <Image
                        src={r.image_url}
                        alt={r.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-glow-black">{r.name}</p>
                      <p className="text-xs font-medium text-stone-500 capitalize">
                        {r.brand} · {r.category}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

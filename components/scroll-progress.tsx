'use client'

import { useEffect, useRef, useState } from 'react'

const MILESTONES: { threshold: number; label: string }[] = [
  { threshold: 25,  label: '25% of trending explored' },
  { threshold: 50,  label: 'Halfway through today\'s picks' },
  { threshold: 75,  label: 'Almost through all trending' },
  { threshold: 100, label: 'You\'ve seen everything trending ✦' },
]

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [badge, setBadge] = useState<string | null>(null)
  const triggered = useRef(new Set<number>())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return

      const pct = Math.min(100, (scrollTop / docHeight) * 100)
      setProgress(pct)

      for (const { threshold, label } of MILESTONES) {
        if (pct >= threshold && !triggered.current.has(threshold)) {
          triggered.current.add(threshold)
          setBadge(label)
          if (timerRef.current) clearTimeout(timerRef.current)
          timerRef.current = setTimeout(() => setBadge(null), 2200)
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes glowShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes orbPulse {
          0%, 100% { box-shadow: 0 0 5px 2px #FF2D95, 0 0 10px 4px rgba(255,45,149,0.4); }
          50%       { box-shadow: 0 0 9px 4px #FF2D95, 0 0 18px 8px rgba(255,45,149,0.6); }
        }
        @keyframes badgeFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgeFadeOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(6px); }
        }
      `}</style>

      {/* Track */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-[3px]"
        style={{ background: 'rgba(255,45,149,0.10)' }}
        aria-hidden
      >
        {/* Filled portion */}
        <div
          className="h-full relative overflow-visible"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #FF2D95 0%, #ff80c4 45%, #FF2D95 100%)',
            backgroundSize: '200% 100%',
            animation: progress > 1 ? 'glowShimmer 2.4s linear infinite' : 'none',
            transition: 'width 0.12s ease-out',
          }}
        >
          {/* Leading orb */}
          {progress > 1 && progress < 99.5 && (
            <span
              className="absolute right-0 top-1/2 -translate-y-1/2 block w-[10px] h-[10px] rounded-full bg-glow-primary"
              style={{ animation: 'orbPulse 1.6s ease-in-out infinite' }}
            />
          )}
        </div>
      </div>

      {/* Milestone badge */}
      {badge && (
        <div
          key={badge}
          className="fixed bottom-5 right-5 z-50 border-2 border-glow-black bg-glow-black px-4 py-2 font-display font-700 text-[11px] uppercase tracking-widest text-white"
          style={{ animation: 'badgeFadeIn 0.25s ease-out forwards' }}
        >
          <span className="text-glow-primary mr-1.5">✦</span>
          {badge}
        </div>
      )}
    </>
  )
}

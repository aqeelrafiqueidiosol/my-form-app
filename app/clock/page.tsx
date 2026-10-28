'use client'

import { useEffect, useState } from 'react'
import { Backdrop } from '../components/Backdrop'

const STORAGE_KEY = 'clock:hour12'

export default function ClockPage() {
  // Rendered only after mount — the server has no idea what the visitor's clock says.
  const [now, setNow] = useState<Date | null>(null)
  // Safe to read storage during the first render: the server only ever renders the
  // skeleton (now === null), so nothing that depends on this is hydrated.
  const [hour12, setHour12] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      return window.localStorage.getItem(STORAGE_KEY) !== 'false'
    } catch {
      // Private mode / blocked storage — the default is fine.
      return true
    }
  })

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    // 100ms keeps the sub-second progress bar smooth without a rAF loop.
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [])

  const toggleFormat = () => {
    setHour12((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next))
      } catch {
        // Ignore — the preference just won't persist.
      }
      return next
    })
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-12">
      <Backdrop />

      <div className="w-full max-w-2xl animate-rise">
        <div className="relative overflow-hidden rounded-[2rem] border border-card-border bg-card p-7 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)] backdrop-blur-2xl sm:p-10">
          {/* Hairline highlight along the top edge of the glass */}
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/25" />

          {now ? (
            <ClockFace now={now} hour12={hour12} onToggleFormat={toggleFormat} />
          ) : (
            <ClockSkeleton />
          )}
        </div>
      </div>
    </main>
  )
}

function ClockFace({
  now,
  hour12,
  onToggleFormat,
}: {
  now: Date
  hour12: boolean
  onToggleFormat: () => void
}) {
  const rawHours = now.getHours()
  const displayHours = hour12 ? rawHours % 12 || 12 : rawHours

  const hh = String(displayHours).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  const meridiem = rawHours < 12 ? 'AM' : 'PM'

  const minuteProgress =
    ((now.getSeconds() * 1000 + now.getMilliseconds()) / 60000) * 100

  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now)

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const timeZoneLabel =
    new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
      .formatToParts(now)
      .find((part) => part.type === 'timeZoneName')?.value ?? timeZone

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
            <ClockIcon />
          </span>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">Local time</h1>
            <p className="text-xs text-muted">
              {timeZone} · {timeZoneLabel}
            </p>
          </div>
        </div>

        <FormatToggle hour12={hour12} onToggle={onToggleFormat} />
      </header>

      <div
        role="timer"
        aria-live="off"
        aria-label={`Current time ${hh}:${mm}:${ss}${hour12 ? ` ${meridiem}` : ''}`}
        className="mt-8 flex items-end justify-center gap-1.5 font-mono sm:gap-2.5"
      >
        <DigitGroup value={hh} />
        <Colon />
        <DigitGroup value={mm} />
        <Colon />
        <DigitGroup value={ss} small />

        {hour12 && (
          <span className="mb-2 ml-1 text-xs font-semibold tracking-widest text-muted sm:mb-3 sm:ml-2 sm:text-sm">
            {meridiem}
          </span>
        )}
      </div>

      {/* Sweep of the current minute */}
      <div className="mt-8 h-1 overflow-hidden rounded-full bg-field-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-[width] duration-100 ease-linear"
          style={{ width: `${minuteProgress}%` }}
        />
      </div>

      <p className="mt-5 text-center text-sm text-muted sm:text-base">{date}</p>
    </>
  )
}

function DigitGroup({ value, small = false }: { value: string; small?: boolean }) {
  return (
    <div className={`flex ${small ? 'gap-1' : 'gap-1.5 sm:gap-2'}`}>
      {value.split('').map((char, index) => (
        <Digit key={index} char={char} small={small} />
      ))}
    </div>
  )
}

function Digit({ char, small }: { char: string; small: boolean }) {
  const size = small
    ? 'h-12 w-9 text-2xl sm:h-16 sm:w-12 sm:text-4xl'
    : 'h-20 w-14 text-4xl sm:h-28 sm:w-20 sm:text-6xl'

  return (
    <span
      className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-field-border bg-field font-semibold tabular-nums shadow-sm sm:rounded-2xl ${size} ${
        small ? 'text-muted' : ''
      }`}
    >
      {/* Glass sheen across the top half of the tile */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent dark:from-white/[0.07]" />
      {/* Re-keying on the character remounts the span, replaying the rise animation */}
      <span key={char} className="animate-rise">
        {char}
      </span>
    </span>
  )
}

function Colon() {
  return (
    <span
      aria-hidden
      className="flex h-20 flex-col justify-center gap-2.5 px-0.5 sm:h-28 sm:gap-4 sm:px-1"
    >
      <Dot />
      <Dot />
    </span>
  )
}

function Dot() {
  return (
    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 [animation-duration:2s] sm:h-2 sm:w-2" />
  )
}

function FormatToggle({ hour12, onToggle }: { hour12: boolean; onToggle: () => void }) {
  return (
    <div className="flex rounded-xl border border-field-border bg-field p-1 text-xs font-medium">
      {([true, false] as const).map((value) => {
        const active = hour12 === value
        return (
          <button
            key={String(value)}
            type="button"
            onClick={() => {
              if (!active) onToggle()
            }}
            aria-pressed={active}
            className={`rounded-lg px-3 py-1.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
              active
                ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-sm shadow-indigo-600/25'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {value ? '12h' : '24h'}
          </button>
        )
      })}
    </div>
  )
}

function ClockSkeleton() {
  return (
    <div className="flex h-[19.5rem] items-center justify-center sm:h-[21.5rem]">
      <span className="text-sm text-muted">Syncing with your clock…</span>
    </div>
  )
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

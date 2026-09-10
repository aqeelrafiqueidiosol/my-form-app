'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Status =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'success'; message: string }
  | { state: 'error'; message: string }

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>({ state: 'idle' })

  const isLoading = status.state === 'loading'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ state: 'loading' })

    const { error } = await supabase
      .from('submissions')
      .insert([{ name, email }])

    if (error) {
      console.error(error)
      setStatus({ state: 'error', message: 'Something went wrong. Please try again.' })
    } else {
      setStatus({ state: 'success', message: `Thanks, ${name.split(' ')[0] || 'friend'} — we'll be in touch.` })
      setName('')
      setEmail('')
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-12">
      <Backdrop />

      <div className="w-full max-w-md animate-rise">
        <div className="relative rounded-3xl border border-card-border bg-card p-8 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)] backdrop-blur-2xl sm:p-10">
          {/* Hairline highlight along the top edge of the glass */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/25" />

          <header className="mb-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
              <MailIcon />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              Get in touch
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Leave your details and we&apos;ll get back to you shortly.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field
              id="name"
              label="Name"
              type="text"
              placeholder="Ada Lovelace"
              autoComplete="name"
              value={name}
              onChange={setName}
              disabled={isLoading}
              icon={<UserIcon />}
            />

            <Field
              id="email"
              label="Email"
              type="email"
              placeholder="ada@example.com"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              disabled={isLoading}
              icon={<AtIcon />}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {isLoading ? (
                <>
                  <Spinner />
                  Submitting…
                </>
              ) : (
                <>
                  Send message
                  <ArrowIcon />
                </>
              )}
            </button>
          </form>

          {(status.state === 'success' || status.state === 'error') && (
            <p
              role="status"
              aria-live="polite"
              className={`mt-5 flex animate-rise items-center gap-2.5 rounded-xl border px-4 py-3 text-sm ${
                status.state === 'success'
                  ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300'
              }`}
            >
              {status.state === 'success' ? <CheckIcon /> : <AlertIcon />}
              {status.message}
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Your details are stored securely and never shared.
        </p>
      </div>
    </main>
  )
}

function Field({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  value,
  onChange,
  disabled,
  icon,
}: {
  id: string
  label: string
  type: string
  placeholder: string
  autoComplete: string
  value: string
  onChange: (value: string) => void
  disabled: boolean
  icon: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted"
      >
        {label}
      </label>
      <div className="group relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted transition-colors group-focus-within:text-indigo-500">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          disabled={disabled}
          className="w-full rounded-xl border border-field-border bg-field py-3.5 pl-11 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-muted/60 hover:border-indigo-400/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 disabled:opacity-60"
        />
      </div>
    </div>
  )
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full blur-3xl animate-float-slow"
        style={{ background: 'radial-gradient(circle, var(--glow-a), transparent 70%)' }}
      />
      <div
        className="absolute -bottom-32 -right-20 h-[30rem] w-[30rem] rounded-full blur-3xl animate-float-slow [animation-delay:-6s]"
        style={{ background: 'radial-gradient(circle, var(--glow-b), transparent 70%)' }}
      />
      <div
        className="absolute left-1/2 top-1/3 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full blur-3xl animate-float-slow [animation-delay:-12s]"
        style={{ background: 'radial-gradient(circle, var(--glow-c), transparent 70%)' }}
      />
      {/* Faint grid, faded out toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(to right, color-mix(in srgb, var(--foreground) 8%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />
    </div>
  )
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function AtIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m2.5 7 8.4 5.6a2 2 0 0 0 2.2 0L21.5 7" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-1">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4.5M12 16h.01" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

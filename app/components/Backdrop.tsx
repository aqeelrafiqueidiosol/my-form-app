export function Backdrop() {
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

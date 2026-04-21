export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 select-none whitespace-nowrap font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none';

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-full',
    md: 'px-6 py-3 text-sm md:text-base rounded-full',
    lg: 'px-7 py-4 text-base rounded-full',
  };

  const variants = {
    primary: 'glow-btn text-ink',
    outline:
      'border border-stroke2 text-pearl hover:border-sky-500/40 hover:bg-white/[0.04]',
    danger:
      'bg-red-500/90 hover:bg-red-500 text-white shadow-[0_0_0_1px_rgba(239,68,68,0.25),0_18px_60px_rgba(0,0,0,0.55)]',
    ghost: 'text-gray-200 hover:text-pearl hover:bg-white/[0.06]',
  };

  return (
    <button
      className={`${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? variants.primary
        } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

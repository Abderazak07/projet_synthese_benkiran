export default function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-sky-500/10 text-sky-500 border-sky-500/25',
    success: 'bg-green-500/15 text-green-300 border-green-500/30',
    warning: 'bg-yellow-500/15 text-yellow-200 border-yellow-500/30',
    danger: 'bg-red-500/15 text-red-200 border-red-500/30',
    info: 'bg-blue-500/15 text-blue-200 border-blue-500/30',
    neutral: 'bg-white/[0.06] text-gray-200 border-white/10',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </span>
  );
}

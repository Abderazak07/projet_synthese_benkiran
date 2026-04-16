export default function Badge({ children, variant = 'primary' }) {
    const variants = {
      primary: 'bg-primary/20 text-primary border-primary/50',
      success: 'bg-green-500/20 text-green-400 border-green-500/50',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      danger: 'bg-red-500/20 text-red-400 border-red-500/50',
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/50'
    };
  
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${variants[variant] || variants.primary}`}>
        {children}
      </span>
    );
  }

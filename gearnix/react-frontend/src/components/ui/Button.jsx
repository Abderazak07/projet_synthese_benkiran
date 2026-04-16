export default function Button({ children, className = '', variant = 'primary', ...props }) {
    const base = 'px-4 py-2 font-medium rounded-lg transition-all duration-300';
    
    let style = '';
    if (variant === 'primary') {
      style = 'glow-btn text-white';
    } else if (variant === 'outline') {
      style = 'border border-primary text-primary hover:bg-primary/20';
    } else if (variant === 'danger') {
      style = 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    } else if (variant === 'ghost') {
      style = 'text-gray-300 hover:text-white hover:bg-white/10';
    }
  
    return (
      <button className={`${base} ${style} ${className}`} {...props}>
        {children}
      </button>
    );
  }

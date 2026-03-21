"use client";

interface ActionButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function ActionButton({ onClick, children, disabled = false }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-24 h-16 md-4 rounded-full transition-all duration-200 flex items-center justify-center text-xs font-medium ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer hover:opacity-90'
      }`}
      style={{
        backgroundColor: disabled ? 'var(--bg-secondary)' : 'var(--bg-accent)',
        color: 'var(--text-primary)',
        border: `2px solid ${disabled ? 'var(--border-primary)' : 'var(--bg-accent)'}`
      }}
    >
      {children}
    </button>
  );
}
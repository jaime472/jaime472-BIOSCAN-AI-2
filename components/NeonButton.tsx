import React from 'react';

interface NeonButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  component?: 'button' | 'label';
  htmlFor?: string;
  className?: string;
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  onClick, 
  children, 
  disabled, 
  component = 'button', 
  htmlFor,
  className = ''
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center 
    px-8 py-4 font-bold text-neon transition-all duration-200 
    bg-dark-card border-2 border-neon 
    hover:bg-neon hover:text-black hover:shadow-neon-strong
    active:translate-y-1 active:shadow-none
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:bg-dark-card disabled:hover:text-neon
    uppercase tracking-widest cursor-pointer
    transform preserve-3d
    ${className}
  `;

  // Simulating 3D depth with box-shadow in CSS class .shadow-3d defined in index.html for simplicity 
  // but let's reinforce it with inline tailwind for specific state
  const depthClasses = "shadow-[4px_4px_0px_#1a5c0d] active:shadow-[0px_0px_0px_#1a5c0d] active:translate-x-[4px] active:translate-y-[4px]";

  if (component === 'label') {
    return (
      <label htmlFor={htmlFor} className={`${baseClasses} ${depthClasses} ${disabled ? 'pointer-events-none' : ''}`}>
        {children}
      </label>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${depthClasses}`}>
      {children}
    </button>
  );
};

export default NeonButton;

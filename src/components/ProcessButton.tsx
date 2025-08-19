// components/ProcessButton.tsx
import React from 'react';

interface ProcessButtonProps {
  onClick: () => void;
  label: string;
}

const ProcessButton: React.FC<ProcessButtonProps> = ({ onClick, label }) => (
  <button onClick={onClick} className="button">
    {label}
  </button>
);

export default ProcessButton;

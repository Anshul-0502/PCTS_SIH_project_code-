import React from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  color?: string;
  barsCount?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ 
  isActive, 
  color = 'bg-medical-500', 
  barsCount = 18 
}) => {
  return (
    <div className="flex items-center justify-center gap-1.5 h-12 px-4 py-2">
      {Array.from({ length: barsCount }).map((_, i) => {
        // Stagger animation delays for natural voice cadence
        const delay = (i % 6) * 0.12;
        const animationClass = isActive ? `animate-wave-bar-${(i % 7) + 1}` : '';
        
        return (
          <span
            key={i}
            style={{ animationDelay: `${delay}s` }}
            className={`w-1 rounded-full transition-all duration-200 ${color} ${animationClass} ${
              isActive ? 'h-8' : 'h-1.5 opacity-40'
            }`}
          />
        );
      })}
    </div>
  );
};

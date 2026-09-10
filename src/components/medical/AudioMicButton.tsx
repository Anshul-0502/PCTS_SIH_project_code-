import React from 'react';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { VoiceSessionState } from '../../types/consultation';

interface AudioMicButtonProps {
  state: VoiceSessionState;
  onClick: () => void;
  disabled?: boolean;
}

export const AudioMicButton: React.FC<AudioMicButtonProps> = ({ state, onClick, disabled = false }) => {
  const isListening = state === 'listening';
  const isProcessing = state === 'processing';
  const isSpeaking = state === 'ai_speaking';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Animated Ripple for active listening */}
        {isListening && (
          <>
            <span className="absolute -inset-3 rounded-full bg-red-400/30 animate-ping opacity-75" />
            <span className="absolute -inset-6 rounded-full bg-red-300/20 animate-pulse" />
          </>
        )}

        {/* AI Speaking glow */}
        {isSpeaking && (
          <span className="absolute -inset-4 rounded-full bg-medical-400/30 animate-pulse" />
        )}

        {/* Central Circular Button */}
        <button
          onClick={onClick}
          disabled={disabled || isProcessing}
          id="ai-mic-trigger-button"
          aria-label={isListening ? 'Stop Speaking' : 'Tap to Speak'}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all transform active:scale-95 focus:ring-4 focus:ring-offset-2 ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30 focus:ring-red-400'
              : isSpeaking
              ? 'bg-gradient-to-tr from-teal-600 to-medical-600 shadow-teal-500/30 focus:ring-teal-400'
              : 'bg-gradient-to-tr from-medical-600 to-medical-500 hover:from-medical-700 hover:to-medical-600 shadow-medical-500/35 focus:ring-medical-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isProcessing ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isListening ? (
            <MicOff className="w-10 h-10 animate-bounce" />
          ) : isSpeaking ? (
            <Volume2 className="w-10 h-10 animate-pulse" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </button>
      </div>

      {/* Dynamic Status Text */}
      <div className="text-center">
        <p className="text-xs font-bold tracking-wide uppercase text-slate-700">
          {isListening ? (
            <span className="text-red-600 flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              Listening... Tap to Stop
            </span>
          ) : isProcessing ? (
            <span className="text-medical-600">Processing Speech...</span>
          ) : isSpeaking ? (
            <span className="text-teal-600">AI Assistant is speaking</span>
          ) : (
            <span>Tap to speak</span>
          )}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {isListening ? 'Speak your symptoms clearly in Hindi or English' : 'Click microphone to respond'}
        </p>
      </div>
    </div>
  );
};

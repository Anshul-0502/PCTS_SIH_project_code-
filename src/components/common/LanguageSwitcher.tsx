import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage, AppLanguage } from '../../store/LanguageContext';

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: Array<{ code: AppLanguage; label: string; nativeLabel: string; iconChar: string }> = [
    { code: 'en', label: 'English', nativeLabel: 'English', iconChar: 'A' },
    { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', iconChar: 'अ' },
  ];

  const current = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors focus:ring-2 focus:ring-medical-500"
        title="Change language / भाषा बदलें"
        id="language-switcher-button"
      >
        <Globe className="w-3.5 h-3.5 text-medical-600" />
        <span className="bg-medical-100 text-medical-800 font-bold px-1 rounded text-[10px]">
          {current.iconChar}
        </span>
        {!compact && <span>{current.nativeLabel}</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Select Language / भाषा
          </div>
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => {
                changeLanguage(l.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                language === l.code
                  ? 'bg-medical-50 text-medical-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                  {l.iconChar}
                </span>
                <span>{l.nativeLabel}</span>
                <span className="text-slate-400 text-[11px]">({l.label})</span>
              </div>
              {language === l.code && <Check className="w-3.5 h-3.5 text-medical-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

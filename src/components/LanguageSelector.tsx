import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, LanguageCode } from '../lib/i18n';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LanguageSelectorProps {
  variant?: 'header' | 'compact' | 'pill';
  className?: string;
}

export default function LanguageSelector({ variant = 'header', className = '' }: LanguageSelectorProps) {
  const { language, setLanguage, languages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = languages.find((l) => l.code === language) || languages[0];

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center p-0.5 rounded-lg bg-[#141d17] border border-[#26372c] text-xs ${className}`}>
        {languages.map((l) => {
          const isSelected = l.code === language;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                isSelected
                  ? 'bg-[#1f4230] text-white font-semibold shadow-xs'
                  : 'text-[#8ca193] hover:text-white hover:bg-[#1a261f]'
              }`}
            >
              <span className="mr-1">{l.flag}</span>
              <span>{l.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-[#18231c] hover:bg-[#202e25] border border-[#28372d] text-[#eff3ef] transition-colors focus:outline-none focus:ring-1 focus:ring-[#37634b]"
        aria-label="Select Language"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#869e90]" />
        <span className="text-[11px] font-medium">{currentOption.nativeLabel}</span>
        <ChevronDown className={`w-3 h-3 text-[#869e90] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-1.5 w-36 rounded-lg bg-[#141d17] border border-[#27382c] shadow-xl overflow-hidden z-50 divide-y divide-[#1b271f]"
          >
            <div className="py-1">
              {languages.map((opt) => {
                const isSelected = opt.code === language;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setLanguage(opt.code);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#1e3829] text-white font-semibold'
                        : 'text-[#cad6cd] hover:bg-[#19261e] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{opt.flag}</span>
                      <span>{opt.nativeLabel}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#82c499]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

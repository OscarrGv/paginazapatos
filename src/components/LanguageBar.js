'use client';

import { useAppContext } from '@/context/AppContext';

const LANGUAGES = [
  { code: 'es', flag: '🇲🇽', label: 'Español' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'zh', flag: '🇨🇳', label: '中文' },
  { code: 'ja', flag: '🇯🇵', label: '日本語' },
];

export default function LanguageBar() {
  const { language, setLanguage } = useAppContext();

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(90deg, #1a1a1a 0%, #2d2008 50%, #1a1a1a 100%)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
      zIndex: 60,
      position: 'relative',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '6px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '4px',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: '0.72rem',
          color: 'rgba(212, 175, 55, 0.7)',
          marginRight: '10px',
          fontWeight: 500,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          🌐 Idioma:
        </span>

        {LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              title={lang.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: '20px',
                border: isActive
                  ? '1px solid rgba(212, 175, 55, 0.8)'
                  : '1px solid rgba(255,255,255,0.08)',
                background: isActive
                  ? 'rgba(212, 175, 55, 0.18)'
                  : 'transparent',
                color: isActive ? '#d4af37' : 'rgba(255,255,255,0.55)',
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                }
              }}
            >
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>{lang.flag}</span>
              <span className="lang-label">{lang.label}</span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        @media (max-width: 600px) {
          .lang-label { display: none; }
        }
      `}</style>
    </div>
  );
}

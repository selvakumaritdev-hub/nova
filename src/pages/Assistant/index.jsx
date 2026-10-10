import React from 'react';
import { Bot, Sparkles, Zap } from 'lucide-react';
import { AIAssistantWidget } from '../../components/assistant/AIAssistantWidget';
import { useLanguage } from '../../context/LanguageContext';

export const Assistant = () => {
  const { t } = useLanguage();

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <span className="section-tag">
          <Sparkles size={14} />
          <span>Intelligent Concierge</span>
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '6px' }}>
          {t('ai_title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          {t('ai_subtitle')}
        </p>
      </div>

      {/* Embedded Full-Page AI Assistant Container */}
      <div style={{ height: '650px', width: '100%' }}>
        <AIAssistantWidget isFloating={false} />
      </div>
    </div>
  );
};

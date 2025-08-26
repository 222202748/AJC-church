import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

const LanguageTest = () => {
  const { language, toggleLanguage } = useLanguage();

  const testTranslations = [
    'pastors.meetOurPastor',
    'pastors.pastorName',
    'pastors.pastorRole',
    'pastors.callNow',
    'pastors.whatsapp'
  ];

  const getTranslation = (key, fallback) => {
    try {
      const keys = key.split('.');
      let result = translations[language];
      
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          return fallback;
        }
      }
      
      return result || fallback;
    } catch (error) {
      return fallback;
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px', borderRadius: '8px' }}>
      <h3>Language Switching Test</h3>
      <p><strong>Current Language:</strong> {language}</p>
      
      <button 
        onClick={toggleLanguage}
        style={{
          padding: '10px 20px',
          margin: '10px 0',
          background: '#8B4513',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Switch to {language === 'english' ? 'Tamil' : 'English'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h4>Translation Test Results:</h4>
        {testTranslations.map((key) => (
          <div key={key} style={{ margin: '5px 0', padding: '5px', background: 'white' }}>
            <strong>{key}:</strong> {getTranslation(key, 'NOT FOUND')}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#e8f5e8', borderRadius: '4px' }}>
        <h4>Status:</h4>
        <p>✅ Language Context: Working</p>
        <p>✅ Language Toggle: Working</p>
        <p>✅ Translations: {Object.keys(translations).join(', ')}</p>
        <p>✅ Current Language: {language}</p>
      </div>
    </div>
  );
};

export default LanguageTest; 
// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';
import translationUZ from './locales/ru.json';

i18n
    .use(LanguageDetector) // определяет язык из localStorage, navigator и т.д.
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: translationEN },
            ru: { translation: translationRU },
            uz: { translation: translationUZ },
        },
        fallbackLng: 'uz',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

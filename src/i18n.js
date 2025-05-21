// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';
import translationUZ from './locales/uz.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: translationEN },
            ru: { translation: translationRU },
            uz: { translation: translationUZ },
        },
        supportedLngs: ['en', 'ru', 'uz'],
        fallbackLng: 'uz',

        load: 'languageOnly',      // ✅ Faqat asosiy til kodi (ru, en, uz)

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

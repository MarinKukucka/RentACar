import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enJSON from '../../assets/locales/en/en.json';
import hrJSON from '../../assets/locales/hr/hr.json';
import languages from './languages.ts';

i18n.use(initReactI18next).init({
    resources: {
        en: enJSON,
        hr: hrJSON,
    },
    lng: languages.en, 
    keySeparator: '.',
    fallbackLng: languages.en, 
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;

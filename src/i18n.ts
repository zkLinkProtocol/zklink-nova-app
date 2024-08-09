import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import enJSON from "./locales/en.json";
import koJSON from "./locales/ko.json";
import zhCNJSON from "./locales/zh-CN.json";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { ...enJSON },
      ko: { ...koJSON },
      zh_CN: { ...zhCNJSON },
    },
    lng: "en",
  });

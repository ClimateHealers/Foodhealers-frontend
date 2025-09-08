import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { en } from "../locales/en.json";
import { be } from "../locales/be.json";
import { ch } from "../locales/ch.json";
import { hi } from "../locales/hi.json";
import { ma } from "../locales/ma.json";
import { pu } from "../locales/pu.json";
import { es } from "../locales/es.json";
import { fr } from "../locales/fr.json";

// Initialize I18n with translations
const localized = new I18n({
  en,
  be,
  ch,
  hi,
  ma,
  pu,
  es,
  fr,
});

localized.enableFallback = true;
localized.defaultLocale = "en";
const preferredLocales = getLocales();

const deviceLocale =
  preferredLocales.length > 0 ? preferredLocales[0].languageTag : "en";
localized.locale = deviceLocale;

function settingFallback(locale?: string) {
  if (locale && localized.translations[locale]) {
    localized.locale = locale;
  } else if (preferredLocales.length > 0) {
    localized.locale = preferredLocales[0].languageCode || "en";
  } else {
    localized.locale = "en";
  }
}

settingFallback(deviceLocale);

export { localized };
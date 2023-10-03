import * as Localization from "expo-localization";
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

// Set the key-value pairs for the different languages you want to support.
const localized = new I18n({
  en: en,
  be: be,
  ch: ch,
  hi: hi,
  ma: ma,
  pu: pu,
  es: es,
  fr: fr,
});

localized.locale = Localization.locale;

const preferredLocales = getLocales();

function settingFallback(locale: any) {
  if (localized.translations[locale]) {
    localized.locale = locale;
  } else {
    if (preferredLocales && preferredLocales?.length > 0) {
      localized.locale = preferredLocales[0].languageCode;
    } else {
      localized.locale = "en";
    }
  }
}

settingFallback(Localization.locale);

export { localized };
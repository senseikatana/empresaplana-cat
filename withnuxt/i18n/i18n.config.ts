// vue-i18n config. Los emails usan literal interpolation `{'@'}` en los
// diccionarios (ver i18n/locales/*.json); el compiler default de vue-i18n
// los evalúa a `@` y respeta las interpolaciones nombradas `{name}`/`{n}`.
export default defineI18nConfig(() => ({}));

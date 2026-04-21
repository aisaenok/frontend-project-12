import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './locales/ru.js'

const initI18n = () => {
  const instance = i18next.createInstance()

  return instance
    .use(initReactI18next)
    .init({
      resources: {
        ru,
      },
      lng: 'ru',
      fallbackLng: 'ru',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
    })
    .then(() => instance)
}

export default initI18n

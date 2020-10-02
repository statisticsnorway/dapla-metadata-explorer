import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

const errorString = 'A problem occured'

export const TEST_CONFIGURATIONS = {
  alternativeApi: 'http://localhost:9999',
  apiContext: (fn) => ({
    ldsApi: window._env.REACT_APP_EXPLORATION_LDS,
    setLdsApi: fn
  }),
  errorString: errorString,
  errorObject: { response: { data: errorString } },
  language: LANGUAGE.LANGUAGES.NORWEGIAN.languageCode,
  otherLanguage: LANGUAGE.LANGUAGES.ENGLISH.languageCode
}

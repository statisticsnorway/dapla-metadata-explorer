import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

const errorString = 'A problem occured'

export const TEST_CONFIGURATIONS = {
  alternativeApi: 'http://localhost:29999',
  apiContext: (initialApi, fn1, fn2) => ({
    ldsApi: initialApi,
    setLdsApi: fn1,
    apiReadOnly: true,
    setApiReadOnly: fn2
  }),
  userContext: fn => ({
    user: 'Test',
    setUser: fn
  }),
  errorString: errorString,
  errorObject: { response: { data: errorString } },
  language: LANGUAGE.LANGUAGES.NORWEGIAN.languageCode,
  otherLanguage: LANGUAGE.LANGUAGES.ENGLISH.languageCode,
  modelDescriptionPath: ['definitions', 'About', 'properties', 'model_version', 'description']
}

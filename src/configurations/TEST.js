import { API } from './'
import { LANGUAGE } from '../enums'

const errorString = 'A problem occured'

export const TEST_CONFIGURATIONS = {
  alternativeApi: 'http://localhost:9999',
  apiContext: (fn, fn2) => ({
    graphqlApi: `${process.env.REACT_APP_API}${API.GRAPHQL}`,
    restApi: process.env.REACT_APP_API,
    setRestApi: fn,
    setGraphqlApi: fn2
  }),
  errorHeader: 'Error header',
  errorString: errorString,
  errorObject: { response: { data: errorString } },
  errorStatus: { response: { statusText: errorString } },
  language: LANGUAGE.LANGUAGES.NORWEGIAN.languageCode,
  objectToString: '[object Object]',
  otherLanguage: LANGUAGE.LANGUAGES.ENGLISH.languageCode
}

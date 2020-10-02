import React, { useState } from 'react'
import { ClientContext, GraphQLClient } from 'graphql-hooks'
import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

import { API } from '../configurations'

export const ApiContext = React.createContext({ ldsApi: window._env.REACT_APP_EXPLORATION_LDS })

export const LanguageContext = React.createContext(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)

export const SchemasContext = React.createContext(null)

export const AppContextProvider = (props) => {
  const [schemas, setSchemas] = useState(null)
  const [ldsApi, setLdsApi] = useState(window._env.REACT_APP_EXPLORATION_LDS)
  const [language, setLanguage] = useState(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)

  const graphqlClient = new GraphQLClient({ url: `${ldsApi}${API.GRAPHQL}` })

  return (
    <ClientContext.Provider value={graphqlClient}>
      <ApiContext.Provider value={{ ldsApi, setLdsApi }}>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <SchemasContext.Provider value={{ schemas, setSchemas }}>
            {props.children}
          </SchemasContext.Provider>
        </LanguageContext.Provider>
      </ApiContext.Provider>
    </ClientContext.Provider>
  )
}

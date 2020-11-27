import React, { useState } from 'react'
import { ClientContext, GraphQLClient } from 'graphql-hooks'
import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

import { API, STORAGE } from '../configurations'

export const ApiContext = React.createContext({
  graphqlApi: `${window._env.REACT_APP_EXPLORATION_LDS}${API.GRAPHQL}`,
  ldsApi: window._env.REACT_APP_EXPLORATION_LDS
})

export const LanguageContext = React.createContext(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)

export const SchemasContext = React.createContext(null)

export const UserContext = React.createContext(null)

export const AppContextProvider = (props) => {
  const [schemas, setSchemas] = useState(null)
  const [user, setUser] = useState(localStorage.hasOwnProperty(STORAGE.USER) ? localStorage.getItem(STORAGE.USER) : 'Test')
  const [ldsApi, setLdsApi] = useState(localStorage.hasOwnProperty(STORAGE.LDS) ? localStorage.getItem(STORAGE.LDS) : window._env.REACT_APP_EXPLORATION_LDS)
  const [language, setLanguage] = useState(localStorage.hasOwnProperty(STORAGE.LANGUAGE) ? localStorage.getItem(STORAGE.LANGUAGE) : LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)
  const [graphqlApi, setGraphqlApi] = useState(`${localStorage.hasOwnProperty(STORAGE.LDS) ? localStorage.getItem(STORAGE.LDS) : window._env.REACT_APP_EXPLORATION_LDS}${API.GRAPHQL}`)
  const [apiReadOnly, setApiReadOnly] = useState(ldsApi === window._env.REACT_APP_EXPLORATION_LDS)

  const graphqlClient = new GraphQLClient({ url: `${graphqlApi}` })

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ClientContext.Provider value={graphqlClient}>
        <ApiContext.Provider value={{ ldsApi, setLdsApi, graphqlApi, setGraphqlApi, apiReadOnly, setApiReadOnly }}>
          <LanguageContext.Provider value={{ language, setLanguage }}>
            <SchemasContext.Provider value={{ schemas, setSchemas }}>
              {props.children}
            </SchemasContext.Provider>
          </LanguageContext.Provider>
        </ApiContext.Provider>
      </ClientContext.Provider>
    </UserContext.Provider>
  )
}

import React, { useState } from 'react'
import { ClientContext, GraphQLClient } from 'graphql-hooks'

import { API } from '../configurations'
import { LANGUAGE } from '../enums'

export const ApiContext = React.createContext({
  graphqlApi: `${process.env.REACT_APP_API}${API.GRAPHQL}`,
  restApi: process.env.REACT_APP_API
})

export const LanguageContext = React.createContext(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)

export const SchemasContext = React.createContext(null)

export const AppContextProvider = (props) => {
  const [schemas, setSchemas] = useState(null)
  const [restApi, setRestApi] = useState(process.env.REACT_APP_API)
  const [language, setLanguage] = useState(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)
  const [graphqlApi, setGraphqlApi] = useState(`${process.env.REACT_APP_API}${API.GRAPHQL}`)

  const graphqlClient = new GraphQLClient({ url: `${graphqlApi}` })

  return (
    <ClientContext.Provider value={graphqlClient}>
      <ApiContext.Provider value={{ graphqlApi, restApi, setGraphqlApi, setRestApi }}>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <SchemasContext.Provider value={{ schemas, setSchemas }}>
            {props.children}
          </SchemasContext.Provider>
        </LanguageContext.Provider>
      </ApiContext.Provider>
    </ClientContext.Provider>
  )
}

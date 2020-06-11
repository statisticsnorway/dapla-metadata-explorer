import React, { useContext } from 'react'
import { Message } from 'semantic-ui-react'

import { getNestedObject, LanguageContext } from '../utilities'
import { API } from '../configurations'
import { UI } from '../enums'

function ErrorMessage ({ error, title }) {
  const { language } = useContext(LanguageContext)

  const resolveError = getNestedObject(error, API.ERROR_PATH)
  const alternateResolveError = getNestedObject(error, API.ERROR_STATUS_PATH)

  return <Message
    error
    header={title ? title : UI.ERROR[language]}
    content={resolveError === undefined ? alternateResolveError === undefined ?
      error.toString() : alternateResolveError : resolveError
    }
  />
}

export default ErrorMessage

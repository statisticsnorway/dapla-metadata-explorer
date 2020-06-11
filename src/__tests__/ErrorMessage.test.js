import React from 'react'
import { render } from '@testing-library/react'

import { ErrorMessage } from '../components'
import { AppContextProvider } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'

const { errorHeader, errorObject, errorStatus, errorString, objectToString } = TEST_CONFIGURATIONS

const setup = (error, title) => {
  const { getByText } = render(
    <AppContextProvider>
      <ErrorMessage error={error} title={title} />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders string errors', () => {
  const { getByText } = setup(errorString)

  expect(getByText(errorString)).toBeInTheDocument()
})

test('Renders object errors when object traverse is possible', () => {
  const { getByText } = setup(errorObject)

  expect(getByText(errorString)).toBeInTheDocument()
})

test('Renders object errors when alternative object traverse is possible', () => {
  const { getByText } = setup(errorStatus)

  expect(getByText(errorString)).toBeInTheDocument()
})

test('Renders fallback error when object traverse is impossible', () => {
  const errorObject = { not: { correct: errorString } }
  const { getByText } = setup(errorObject)

  expect(getByText(objectToString)).toBeInTheDocument()
})

test('Renders header when it is provided', () => {
  const { getByText } = setup(errorString, errorHeader)

  expect(getByText(errorHeader)).toBeInTheDocument()
})

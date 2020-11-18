import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { AppHome } from '../components'
import { LanguageContext, SchemasContext } from '../context/AppContext'
import { sortSchemas } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'
import { TEST_IDS } from '../enums'

import Schemas from './test-data/Schemas.json'

jest.mock('../components/AppSearch', () => () => null)
jest.mock('../components/domains/DomainsList', () => () => null)

const { language, modelDescriptionPath } = TEST_CONFIGURATIONS

const sortedSchemas = sortSchemas(Schemas)
const modelDescription = getNestedObject(Schemas[0], modelDescriptionPath)

const setup = initialEntry => {
  const { getByTestId, getByText, queryAllByText } = render(
    <LanguageContext.Provider value={{ language: language }}>
      <SchemasContext.Provider value={{ schemas: sortedSchemas }}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <AppHome />
        </MemoryRouter>
      </SchemasContext.Provider>
    </LanguageContext.Provider>
  )

  return { getByTestId, getByText, queryAllByText }
}

test('Renders basics', () => {
  const { getByText } = setup('/')

  expect(getByText(modelDescription)).toBeInTheDocument()
})

test('Hides component', () => {
  const { getByTestId, getByText } = setup('/')

  userEvent.click(getByTestId(TEST_IDS.HIDE_APP_HOME_BUTTON))

  setTimeout(() => {
    expect(getByText(modelDescription)).not.toBeVisible()
  }, 300)
})

test('Shows component', () => {
  const { getByTestId, getByText } = setup('/import')

  userEvent.click(getByTestId(TEST_IDS.SHOW_APP_HOME_BUTTON))

  setTimeout(() => {
    expect(getByText(modelDescription)).toBeVisible()
  }, 300)
})

test('Starts as hidden if not on home page', () => {
  const { queryAllByText } = setup('/import')

  expect(queryAllByText(modelDescription)).toHaveLength(0)
})

import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import AppSearch from '../components/AppSearch'
import { LanguageContext, SchemasContext } from '../context/AppContext'
import { sortSchemas } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'
import { UI } from '../enums'

import Schemas from './test-data/Schemas.json'

const { language } = TEST_CONFIGURATIONS

const sortedSchemas = sortSchemas(Schemas)
const modelObject1 = getNestedObject(Schemas[5], ['definitions', 'MeasurementUnit', 'description'])
const modelObject2 = getNestedObject(Schemas[9], ['definitions', 'UnitType', 'description'])
const modelObject3 = getNestedObject(Schemas[11], ['definitions', 'Variable', 'description'])

const setup = () => {
  const { getByPlaceholderText, getByText, queryAllByText } = render(
    <LanguageContext.Provider value={{ language: language }}>
      <SchemasContext.Provider value={{ schemas: sortedSchemas }}>
        <MemoryRouter initialEntries={['/']}>
          <AppSearch />
        </MemoryRouter>
      </SchemasContext.Provider>
    </LanguageContext.Provider>
  )

  return { getByPlaceholderText, getByText, queryAllByText }
}

test('Renders basics', () => {
  const { getByPlaceholderText } = setup()

  expect(getByPlaceholderText(UI.SEARCH[language])).toBeInTheDocument()
})

test('Search filters correctly', () => {
  const { getByPlaceholderText, getByText, queryAllByText } = setup()

  userEvent.type(getByPlaceholderText(UI.SEARCH[language]), 'Unit')

  expect(getByText(modelObject1)).toBeVisible()
  expect(getByText(modelObject2)).toBeVisible()
  expect(queryAllByText(modelObject3)).toHaveLength(0)
})

test('Empty search does not trigger', () => {
  const { getByPlaceholderText, getByText, queryAllByText } = setup()

  const input = getByPlaceholderText(UI.SEARCH[language])

  userEvent.type(getByPlaceholderText(UI.SEARCH[language]), 'Variable')

  expect(getByText(modelObject3)).toBeInTheDocument()

  input.setSelectionRange(0, 8)
  userEvent.type(getByPlaceholderText(UI.SEARCH[language]), '{backspace}Q')

  expect(queryAllByText(modelObject3)).toHaveLength(0)
})

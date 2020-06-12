import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AppSearch } from '../components'
import { getDomainDisplayName, LanguageContext, SchemasContext, sortSchemas } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'
import { UI } from '../enums'

import UnitType from './test-data/UnitType'

const { language } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByPlaceholderText, getByText } = render(
    <LanguageContext.Provider value={{ language: language }}>
      <SchemasContext.Provider value={{ schemas: sortSchemas([UnitType]) }}>
        <MemoryRouter>
          <AppSearch ready={true} />
        </MemoryRouter>
      </SchemasContext.Provider>
    </LanguageContext.Provider>
  )

  return { getByPlaceholderText, getByText }
}

test('Search function works correctly', async () => {
  const { getByPlaceholderText, getByText } = setup()

  await userEvent.type(getByPlaceholderText(UI.SEARCH[language]), 'Un')

  expect(getByText(getDomainDisplayName(UnitType))).toBeInTheDocument()
})

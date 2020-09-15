import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { DomainsList } from '../components/domains'
import { LanguageContext, SchemasContext } from '../context/AppContext'
import { getDomainDescription, sortSchemas } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'

import RepresentedVariable from './test-data/RepresentedVariable.json'

const { language } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText } = render(
    <LanguageContext.Provider value={{ language: language }}>
      <SchemasContext.Provider value={{ schemas: sortSchemas([RepresentedVariable]) }}>
        <MemoryRouter>
          <DomainsList />
        </MemoryRouter>
      </SchemasContext.Provider>
    </LanguageContext.Provider>
  )

  return { getByText }
}

test('Renders domain list', () => {
  const { getByText } = setup()

  userEvent.click(getByText('Concept'))

  expect(getByText(getDomainDescription(RepresentedVariable))).toBeInTheDocument()
})

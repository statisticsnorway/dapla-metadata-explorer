import React from 'react'
import { render } from '@testing-library/react'

import { AppHome } from '../components'
import { LanguageContext, SchemasContext } from '../context/AppContext'
import { sortSchemas } from '../utilities'
import { TEST_CONFIGURATIONS } from '../configurations'

import About from './test-data/About'

jest.mock('../components/domains/DomainsList', () => () => null)
jest.mock('../components/domains/DomainsChart', () => () => null)

const { language } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText } = render(
    <LanguageContext.Provider value={{ language: language }}>
      <SchemasContext.Provider value={{ schemas: sortSchemas([About]) }}>
        <AppHome />
      </SchemasContext.Provider>
    </LanguageContext.Provider>
  )

  return { getByText }
}

test('Renders model information', () => {
  const { getByText } = setup()

  expect(getByText(About.definitions.About.properties.model_version.description)).toBeInTheDocument()
})

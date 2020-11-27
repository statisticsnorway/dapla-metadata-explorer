import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { getLocalizedGsimObjectText } from '@statisticsnorway/dapla-js-utilities'

import { DomainInstanceGraph } from '../components/domain'
import { LanguageContext } from '../context/AppContext'
import { getDomainSchema, sortSchemas } from '../utilities'
import { GSIM, TEST_CONFIGURATIONS } from '../configurations'
import { DOMAIN } from '../enums'

import Schemas from './test-data/Schemas.json'
import PopulationAllData from './test-data/PopulationAllData.json'

const { language } = TEST_CONFIGURATIONS

const domain = 'Population'
const domainSchema = getDomainSchema(domain, sortSchemas(Schemas))

const setup = () => {
  const { getAllByText, getByText } = render(
    <LanguageContext.Provider value={{ language: language }}>
      <DomainInstanceGraph domain={domain} data={PopulationAllData[1]} schema={domainSchema} />
    </LanguageContext.Provider>
  )

  return { getAllByText, getByText }
}

test('Renders basics', () => {
  const { getByText } = setup()

  userEvent.click(getByText(DOMAIN.CONNECTIONS[language]))

  expect(getByText(
    `${DOMAIN.CONNECTIONS_HEADER[language]} '${getLocalizedGsimObjectText(language, PopulationAllData[1][GSIM.NAME])}'`
  )).toBeInTheDocument()
})

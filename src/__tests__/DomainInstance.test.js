import React from 'react'
import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getLocalizedGsimObjectText } from '@statisticsnorway/dapla-js-utilities'

import { DomainInstance } from '../components/domain'
import { ApiContext, LanguageContext, SchemasContext } from '../context/AppContext'
import { camelToTitle, sortSchemas } from '../utilities'
import { GSIM, ROUTING, TEST_CONFIGURATIONS } from '../configurations'

import Schemas from './test-data/Schemas.json'
import PopulationAllData from './test-data/PopulationAllData.json'

// https://stackoverflow.com/questions/58117890/how-to-test-components-using-new-react-router-hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    domain: 'Population',
    id: 'dfb6eecf-c4f4-4fa6-82a1-8b8684d560f4c'
  })
}))

jest.mock('../components/domain/DomainLinkResolve', () => () => null)
jest.mock('../components/domain/DomainInstanceEdit', () => () => null)
jest.mock('../components/domain/DomainInstanceGraph', () => () => null)
jest.mock('../components/domain/DomainInstanceDelete', () => () => null)
jest.mock('../components/domain/DomainInstanceExtendedGraph', () => () => null)

const { language, apiContext } = TEST_CONFIGURATIONS

const refetch = jest.fn()
const domain = 'Population'
const domainId = 'dfb6eecf-c4f4-4fa6-82a1-8b8684d560f4c'
const sortedSchemas = sortSchemas(Schemas)

const setup = () => {
  const { getAllByText, getByText } = render(
    <ApiContext.Provider
      value={apiContext(window._env.REACT_APP_EXPLORATION_LDS, jest.fn(), jest.fn(), jest.fn(), jest.fn())}>
      <LanguageContext.Provider value={{ language: language }}>
        <SchemasContext.Provider value={{ schemas: sortedSchemas }}>
          <MemoryRouter initialEntries={[`${ROUTING.DOMAIN_BASE}${domain}/${domainId}`]}>
            <DomainInstance />
          </MemoryRouter>
        </SchemasContext.Provider>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getAllByText, getByText }
}

test('Renders basics', () => {
  useAxios.mockReturnValue([{ loading: false, error: undefined, data: PopulationAllData[1] }, refetch])

  const { getAllByText, getByText } = setup()

  expect(getAllByText(getLocalizedGsimObjectText(language, PopulationAllData[1][GSIM.NAME]))).toHaveLength(2)
  expect(getByText(camelToTitle(domain))).toBeInTheDocument()
})

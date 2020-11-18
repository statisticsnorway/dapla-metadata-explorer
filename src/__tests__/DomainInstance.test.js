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
import UnitTypeAllData from './test-data/UnitTypeAllData.json'

// https://stackoverflow.com/questions/58117890/how-to-test-components-using-new-react-router-hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    domain: 'UnitType',
    id: '51a8dcde-127d-49de-84a4-a0a9c34f666f'
  })
}))

jest.mock('../components/domain/DomainLinkResolve', () => () => null)
jest.mock('../components/domain/DomainInstanceEdit', () => () => null)

const { language, apiContext } = TEST_CONFIGURATIONS

const refetch = jest.fn()
const domain = 'UnitType'
const domainId = '51a8dcde-127d-49de-84a4-a0a9c34f666f'
const sortedSchemas = sortSchemas(Schemas)

const setup = () => {
  const { getAllByText, getByText } = render(
    <ApiContext.Provider value={apiContext(window._env.REACT_APP_EXPLORATION_LDS, jest.fn(), jest.fn())}>
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
  useAxios.mockReturnValue([{ loading: false, error: undefined, data: UnitTypeAllData[2] }, refetch])

  const { getAllByText, getByText } = setup()

  expect(getAllByText(getLocalizedGsimObjectText(language, UnitTypeAllData[2][GSIM.NAME]))).toHaveLength(3)
  expect(getByText(camelToTitle(domain))).toBeInTheDocument()
})

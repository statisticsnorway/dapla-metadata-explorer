import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Domain, DomainInstance } from '../components/domain'
import { ApiContext, LanguageContext, SchemasContext } from '../context/AppContext'
import { getDomainRef, sortSchemas } from '../utilities'
import { ROUTING, TEST_CONFIGURATIONS } from '../configurations'
import { DOMAIN, TEST_IDS } from '../enums'

import Agent from './test-data/Agent.json'
import AgentData from './test-data/AgentData.json'

// https://stackoverflow.com/questions/58117890/how-to-test-components-using-new-react-router-hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    domain: 'Agent',
    id: '91712998-84a5-4f6c-8053-4dfaafa7c0e3'
  })
}))
jest.mock('../components/domain/DomainLinkResolve', () => () => null)

const { language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()
const testDomain = getDomainRef(Agent)
const testDomainInstanceId = AgentData[0].id
const agentDetails = Agent.definitions.Agent.properties.agentDetails.displayName
const administrativeDetails = Agent.definitions.Agent.properties.administrativeDetails.displayName
const createdDate = Agent.definitions.Agent.properties.createdDate.displayName
const isExternal = Agent.definitions.Agent.properties.isExternal.displayName

const setupDomain = () => {
  const { getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <SchemasContext.Provider value={{ schemas: sortSchemas([Agent]) }}>
          <MemoryRouter initialEntries={[`${ROUTING.DOMAIN_BASE}${testDomain}`]}>
            <Domain />
          </MemoryRouter>
        </SchemasContext.Provider>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByTestId, getByText }
}

const setupDomainInstance = () => {
  const { getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <SchemasContext.Provider value={{ schemas: sortSchemas([Agent]) }}>
          <MemoryRouter initialEntries={[`${ROUTING.DOMAIN_BASE}${testDomain}/${testDomainInstanceId}`]}>
            <DomainInstance />
          </MemoryRouter>
        </SchemasContext.Provider>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByTestId, getByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue([{ data: AgentData, loading: false, error: null }, refetch])

  test('Adds AgentDetails to table correctly', () => {
    const { getByTestId, getByText } = setupDomain()

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getByText(agentDetails))
    userEvent.hover(getByTestId(TEST_IDS.TABLE_HOVER))
  })

  test('Adds AdministrativeDetails to table correctly', () => {
    const { getByTestId, getByText } = setupDomain()

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getByText(administrativeDetails))
    userEvent.hover(getByTestId(TEST_IDS.TABLE_HOVER))
  })

  test('Adds boolean to table correctly', () => {
    const { getByText } = setupDomain()

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getByText(isExternal))
  })

  test('Adds date to table correctly', () => {
    const { getByText } = setupDomain()

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getByText(createdDate))
  })

  test('Domain instance viewing resolves most advanced features', () => {
    const { getByText } = setupDomainInstance()

    expect(getByText(testDomainInstanceId)).toBeInTheDocument()
  })
})

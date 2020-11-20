import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { DomainInstanceEdit } from '../components/domain'
import { ApiContext, LanguageContext, SchemasContext, UserContext } from '../context/AppContext'
import { camelToTitle, sortSchemas } from '../utilities'
import { ROUTING, TEST_CONFIGURATIONS } from '../configurations'
import { DOMAIN } from '../enums'

import Schema from './test-data/AgentSchema.json'
import AgentData from './test-data/AgentData.json'

// https://stackoverflow.com/questions/58117890/how-to-test-components-using-new-react-router-hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    domain: 'Agent',
    id: '91712998-84a5-4f6c-8053-4dfaafa7c0e3'
  })
}))

jest.mock('../components/form/FormInputDropdown', () => () => null)

const { language, apiContext, userContext } = TEST_CONFIGURATIONS

const refetch = jest.fn()
const executePut = jest.fn()
const domain = 'Agent'
const domainId = '91712998-84a5-4f6c-8053-4dfaafa7c0e3'
const sortedSchemas = sortSchemas([Schema])
const modelObject = getNestedObject(Schema, ['definitions', domain, 'description'])

const setup = () => {
  const { getByPlaceholderText, getByText } = render(
    <UserContext.Provider value={userContext(jest.fn())}>
      <ApiContext.Provider value={apiContext(window._env.REACT_APP_CONCEPT_LDS, jest.fn(), jest.fn(), false)}>
        <LanguageContext.Provider value={{ language: language }}>
          <SchemasContext.Provider value={{ schemas: sortedSchemas }}>
            <MemoryRouter initialEntries={[`${ROUTING.DOMAIN_BASE}${domain}/${domainId}`]}>
              <DomainInstanceEdit data={AgentData} refetch={refetch} />
            </MemoryRouter>
          </SchemasContext.Provider>
        </LanguageContext.Provider>
      </ApiContext.Provider>
    </UserContext.Provider>
  )

  return { getByPlaceholderText, getByText }
}

test('Renders basics', () => {
  useAxios.mockReturnValue([{ loading: false, error: undefined, response: undefined }, executePut])

  const { getByText } = setup()

  userEvent.click(getByText(DOMAIN.EDIT[language]))

  expect(getByText(`${DOMAIN.EDIT[language]} '${camelToTitle(domain)}'`)).toBeInTheDocument()
  expect(getByText(modelObject)).toBeInTheDocument()
})

test('Informs user of success when saving edited data', () => {
  useAxios.mockReturnValue([{ loading: false, error: undefined, response: { status: 201 } }, executePut])
  executePut.mockResolvedValue(null)

  const { getByPlaceholderText, getByText } = setup()

  userEvent.click(getByText(DOMAIN.EDIT[language]))

  userEvent.type(getByPlaceholderText('shortName'), 'A short name')

  expect(getByText(DOMAIN.WAS_EDITED[language])).toBeInTheDocument()

  userEvent.click(getByText(DOMAIN.SAVE[language]))

  expect(getByText(DOMAIN.WAS_SAVED[language])).toBeInTheDocument()
})

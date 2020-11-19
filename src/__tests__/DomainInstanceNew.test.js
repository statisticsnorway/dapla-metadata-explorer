import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { DomainInstanceNew } from '../components/domain'
import { ApiContext, LanguageContext, SchemasContext, UserContext } from '../context/AppContext'
import { camelToTitle, sortSchemas } from '../utilities'
import { ROUTING, TEST_CONFIGURATIONS } from '../configurations'
import { DOMAIN, FORM } from '../enums'

import Schemas from './test-data/Schemas.json'

// https://stackoverflow.com/questions/58117890/how-to-test-components-using-new-react-router-hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    domain: 'Population'
  })
}))

jest.mock('../components/form/FormInputDropdown', () => () => null)

const { language, apiContext, userContext } = TEST_CONFIGURATIONS

const domain = 'Population'
const executePut = jest.fn()
const sortedSchemas = sortSchemas(Schemas)
const modelObject = getNestedObject(Schemas[6], ['definitions', domain, 'description'])

const setup = () => {
  const { getByText } = render(
    <UserContext.Provider value={userContext(jest.fn())}>
      <ApiContext.Provider value={apiContext(window._env.REACT_APP_CONCEPT_LDS, jest.fn(), jest.fn(), false)}>
        <LanguageContext.Provider value={{ language: language }}>
          <SchemasContext.Provider value={{ schemas: sortedSchemas }}>
            <MemoryRouter initialEntries={[`${ROUTING.DOMAIN_BASE}${domain}/new`]}>
              <DomainInstanceNew />
            </MemoryRouter>
          </SchemasContext.Provider>
        </LanguageContext.Provider>
      </ApiContext.Provider>
    </UserContext.Provider>
  )

  return { getByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ loading: false, error: undefined, response: undefined }, executePut])
  })

  test('Renders basics', () => {
    const { getByText } = setup()

    expect(getByText(`${DOMAIN.CREATE_NEW[language]} '${camelToTitle(domain)}'`)).toBeInTheDocument()
    expect(getByText(modelObject)).toBeInTheDocument()
  })

  test('Shows form help', () => {
    const { getByText } = setup()

    userEvent.click(getByText(FORM.HEADER[language]))

    expect(getByText(FORM.SETUP[language])).toBeInTheDocument()
  })

  test('Downloads JSON', () => {
    global.URL.createObjectURL = jest.fn()
    const { getByText } = setup()

    userEvent.click(getByText(DOMAIN.GET_JSON[language]))
  })
})

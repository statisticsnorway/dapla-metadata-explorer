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

jest.mock('../components/form/FormInputDropdown', () => () => null)

const { language, apiContext, userContext } = TEST_CONFIGURATIONS

const refetch = jest.fn()
const executePut = jest.fn()
const domain = 'UnitType'
const domainId = '51a8dcde-127d-49de-84a4-a0a9c34f666f'
const sortedSchemas = sortSchemas(Schemas)
const modelObject = getNestedObject(Schemas[9], ['definitions', domain, 'description'])

const setup = () => {
  const { getByText } = render(
    <UserContext.Provider value={userContext(jest.fn())}>
      <ApiContext.Provider value={apiContext(window._env.REACT_APP_EXPLORATION_LDS, jest.fn(), jest.fn())}>
        <LanguageContext.Provider value={{ language: language }}>
          <SchemasContext.Provider value={{ schemas: sortedSchemas }}>
            <MemoryRouter initialEntries={[`${ROUTING.DOMAIN_BASE}${domain}/${domainId}`]}>
              <DomainInstanceEdit data={UnitTypeAllData[2]} refetch={refetch} />
            </MemoryRouter>
          </SchemasContext.Provider>
        </LanguageContext.Provider>
      </ApiContext.Provider>
    </UserContext.Provider>
  )

  return { getByText }
}

test('Renders basics', () => {
  useAxios.mockReturnValue([{ loading: false, error: undefined, response: undefined }, executePut])

  const { getByText } = setup()

  userEvent.click(getByText(DOMAIN.EDIT[language]))

  expect(getByText(`${DOMAIN.EDIT[language]} '${camelToTitle(domain)}'`)).toBeInTheDocument()
  expect(getByText(modelObject)).toBeInTheDocument()
})

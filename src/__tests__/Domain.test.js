import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { Domain } from '../components/domain'
import { ApiContext, LanguageContext, SchemasContext } from '../context/AppContext'
import { camelToTitle, sortSchemas } from '../utilities'
import { ROUTING, TEST_CONFIGURATIONS } from '../configurations'
import { DOMAIN, TEST_IDS } from '../enums'

import Schemas from './test-data/Schemas.json'
import UnitTypeAllData from './test-data/UnitTypeAllData.json'

// https://stackoverflow.com/questions/58117890/how-to-test-components-using-new-react-router-hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    domain: 'UnitType'
  })
}))

jest.mock('../components/domain/DomainLinkResolve', () => () => null)
jest.mock('../components/domain/DomainJsonData', () => () => null)

const { language, apiContext } = TEST_CONFIGURATIONS

const refetch = jest.fn()
const domain = 'UnitType'
const sortedSchemas = sortSchemas(Schemas)
const objectProperty = camelToTitle('typeOfStatisticalUnit')
const modelObject = getNestedObject(Schemas[9], ['definitions', domain, 'description'])

const setup = () => {
  const { container, getAllByText, getByPlaceholderText, getByTestId, getByText, queryAllByText } = render(
    <ApiContext.Provider
      value={apiContext(window.__ENV.REACT_APP_EXPLORATION_LDS, jest.fn(), jest.fn(), jest.fn(), jest.fn())}>
      <LanguageContext.Provider value={{ language: language }}>
        <SchemasContext.Provider value={{ schemas: sortedSchemas }}>
          <MemoryRouter initialEntries={[`${ROUTING.DOMAIN_BASE}${domain}`]}>
            <Domain />
          </MemoryRouter>
        </SchemasContext.Provider>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { container, getAllByText, getByPlaceholderText, getByTestId, getByText, queryAllByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ loading: false, error: undefined, data: UnitTypeAllData }, refetch])
  })

  test('Renders basics', () => {
    const { getByText } = setup()

    expect(getByText(camelToTitle(domain))).toBeInTheDocument()
    expect(getByText(modelObject)).toBeInTheDocument()
  })

  test('Adds table headers correctly', () => {
    const { getByText, getAllByText } = setup()

    expect(getAllByText(objectProperty)).toHaveLength(1)

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getByText(objectProperty))

    expect(getAllByText(objectProperty)).toHaveLength(2)
  })

  test('Removes table headers correctly', () => {
    const { getByText, getAllByText } = setup()

    expect(getAllByText('Description')).toHaveLength(2)

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getAllByText('Description')[0])

    expect(getAllByText('Description')).toHaveLength(1)
  })

  test('Resets table headers correctly', () => {
    const { getByTestId, getByText, getAllByText } = setup()

    expect(getAllByText(objectProperty)).toHaveLength(1)

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getByText(objectProperty))

    expect(getAllByText(objectProperty)).toHaveLength(2)

    userEvent.click(getByTestId(TEST_IDS.DEFAULT_TABLE_HEADERS))

    expect(getAllByText(objectProperty)).toHaveLength(1)
  })

  test('Filters table correctly', () => {
    const { getByPlaceholderText, queryAllByText } = setup()

    userEvent.type(getByPlaceholderText(DOMAIN.SEARCH_TABLE[language]), 'Kommune')

    expect(queryAllByText('Person')).toHaveLength(0)
  })

  test('Sorts table correctly', () => {
    const { getByText, getAllByText } = setup()

    userEvent.click(getAllByText('Name')[1])

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getAllByText('Created By')[0])
    userEvent.click(getAllByText('Created By')[1])

    expect(getAllByText(/^(BNJ|OHV)$/)[0].innerHTML).toEqual('BNJ')

    userEvent.click(getAllByText('Created By')[1])

    expect(getAllByText(/^(BNJ|OHV)$/)[0].innerHTML).toEqual('OHV')
  })

  test('Sorts table correctly with missing value', () => {
    const { container, getByText, getAllByText } = setup()

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getAllByText('Created By')[0])
    userEvent.click(getAllByText('Version')[0])
    userEvent.click(getAllByText('Version')[1])

    expect(container.querySelector('tbody').firstChild.lastChild.innerHTML).toEqual('')

    userEvent.click(getAllByText('Version')[1])

    expect(container.querySelector('tbody').firstChild.lastChild.innerHTML).toEqual('1.0.0')
  })

  test('Sorts table correctly with dates', () => {
    const { getByText, getAllByText } = setup()

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getAllByText('Created Date')[0])
    userEvent.click(getAllByText('Created Date')[1])

    //  Jest uses american date format, which removes leading zeroes
    expect(getAllByText(/^(1\/1\/1985)|(1\/1\/2000)$/)[0].innerHTML).toEqual('1/1/1985')

    userEvent.click(getAllByText('Created Date')[1])

    expect(getAllByText(/^(1\/1\/1985)|(1\/1\/2000)$/)[0].innerHTML).toEqual('1/1/2000')
  })
})

import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Domain } from '../components/domain'
import {
  ApiContext,
  getDomainDisplayName,
  getDomainRef,
  LanguageContext,
  SchemasContext,
  sortSchemas
} from '../utilities'
import { API, ROUTING, TEST_CONFIGURATIONS } from '../configurations'
import { DOMAIN, TEST_IDS, UI } from '../enums'

import RepresentedVariable from './test-data/RepresentedVariable.json'
import RepresentedVariableData from './test-data/RepresentedVariableData.json'

// https://stackoverflow.com/questions/58117890/how-to-test-components-using-new-react-router-hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    domain: 'RepresentedVariable'
  })
}))
jest.mock('../components/domain/DomainLinkResolve', () => () => null)

const { errorString, language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()
const testDomain = getDomainRef(RepresentedVariable)
const variable = RepresentedVariable.definitions.RepresentedVariable.properties.variable.displayName

const setup = () => {
  const { getByTestId, getByText, getAllByText, queryAllByPlaceholderText, queryAllByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <SchemasContext.Provider value={{ schemas: sortSchemas([RepresentedVariable]) }}>
          <MemoryRouter initialEntries={[`${ROUTING.DOMAIN_BASE}${testDomain}`]}>
            <Domain />
          </MemoryRouter>
        </SchemasContext.Provider>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByTestId, getByText, getAllByText, queryAllByPlaceholderText, queryAllByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue([{ data: [], loading: false, error: null }, refetch])

  test('Adds table headers correctly', () => {
    const { getByText, getAllByText } = setup()

    expect(getAllByText(variable)).toHaveLength(1)

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getByText(variable))

    expect(getAllByText(variable)).toHaveLength(2)
  })

  test('Removes table headers correctly', () => {
    const { getByText, getAllByText } = setup()

    expect(getAllByText('Name')).toHaveLength(2)

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getAllByText('Name')[0])

    expect(getAllByText('Name')).toHaveLength(1)
  })

  test('Resets table headers correctly', () => {
    const { getByTestId, getByText, getAllByText } = setup()

    expect(getAllByText(variable)).toHaveLength(1)

    userEvent.click(getByText(DOMAIN.ADJUST_TABLE_HEADERS[language]))
    userEvent.click(getByText(variable))

    expect(getAllByText(variable)).toHaveLength(2)

    userEvent.click(getByTestId(TEST_IDS.DEFAULT_TABLE_HEADERS))

    expect(getAllByText(variable)).toHaveLength(1)
  })
})

test('Loads correctly', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: true, error: null }, refetch])
  setup()

  expect(useAxios).toHaveBeenCalledWith(`${apiContext.restApi}${API.GET_DOMAIN_DATA(testDomain)}`)
})

test('Renders domain correctly', () => {
  useAxios.mockReturnValue([{ data: [], loading: false, error: null }, refetch])
  const { getByText } = setup()

  expect(useAxios).toHaveBeenCalledWith(`${apiContext.restApi}${API.GET_DOMAIN_DATA(testDomain)}`)
  expect(getByText(getDomainDisplayName(RepresentedVariable))).toBeInTheDocument()
})

test('Shows error on error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorString }, refetch])
  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})

test('Search filters table correctly', async () => {
  const RepresentedVariableMunicipality = RepresentedVariableData[0].description[0].languageText
  const RepresentedVariableGender = RepresentedVariableData[2].description[0].languageText
  useAxios.mockReturnValue([{ data: RepresentedVariableData, loading: false, error: null }, refetch])
  const { getAllByText, queryAllByPlaceholderText, queryAllByText } = setup()

  expect(getAllByText(RepresentedVariableMunicipality)).toHaveLength(1)

  await userEvent.type(queryAllByPlaceholderText(UI.SEARCH[language])[0], 'Gender')

  expect(queryAllByText(RepresentedVariableMunicipality)).toHaveLength(0)
  expect(getAllByText(RepresentedVariableGender)).toHaveLength(1)
})

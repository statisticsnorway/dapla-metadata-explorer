import React from 'react'
import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { DomainInstance } from '../components/domain'
import {
  ApiContext,
  getDomainDisplayName,
  getDomainRef,
  LanguageContext,
  SchemasContext,
  sortSchemas
} from '../utilities'
import { API, ROUTING, TEST_CONFIGURATIONS } from '../configurations'

import RepresentedVariable from './test-data/RepresentedVariable.json'
import RepresentedVariableData from './test-data/RepresentedVariableData.json'

// https://stackoverflow.com/questions/58117890/how-to-test-components-using-new-react-router-hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    domain: 'RepresentedVariable',
    id: '8a0e6412-0fb0-46ed-b2e9-e3294b05fa59'
  })
}))
jest.mock('../components/domain/DomainLinkResolve', () => () => null)
jest.mock('../components/domain/DomainInstanceEdit', () => () => null)

const { errorString, language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const refetch = jest.fn()
const testDomain = getDomainRef(RepresentedVariable)
const testDomainInstanceId = RepresentedVariableData[0].id

const setup = () => {
  const { getByTestId, getByText, getAllByText, queryAllByPlaceholderText, queryAllByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <SchemasContext.Provider value={{ schemas: sortSchemas([RepresentedVariable]) }}>
          <MemoryRouter initialEntries={[`${ROUTING.DOMAIN_BASE}${testDomain}/${testDomainInstanceId}`]}>
            <DomainInstance />
          </MemoryRouter>
        </SchemasContext.Provider>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByTestId, getByText, getAllByText, queryAllByPlaceholderText, queryAllByText }
}

test('Loads', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: true, error: null }, refetch])
  setup()

  expect(useAxios)
    .toHaveBeenCalledWith(
      `${apiContext.restApi}${API.GET_DOMAIN_INSTANCE_DATA(testDomain, testDomainInstanceId)}`,
      { manual: true }
    )
})

test('Renders', () => {
  useAxios.mockReturnValue([{ data: {}, loading: false, error: null }, refetch])
  const { getByText } = setup()

  expect(useAxios)
    .toHaveBeenCalledWith(
      `${apiContext.restApi}${API.GET_DOMAIN_INSTANCE_DATA(testDomain, testDomainInstanceId)}`,
      { manual: true }
    )
  expect(getByText(getDomainDisplayName(RepresentedVariable))).toBeInTheDocument()
})

test('Shows error on error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorString }, refetch])
  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})

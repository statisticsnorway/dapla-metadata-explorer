import React from 'react'
import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getLocalizedGsimObjectText } from '@statisticsnorway/dapla-js-utilities'

import { DomainLinkResolve } from '../components/domain'
import { ApiContext, getDomainRef, LanguageContext } from '../utilities'
import { API, TEST_CONFIGURATIONS } from '../configurations'

import RepresentedVariable from './test-data/RepresentedVariable.json'
import RepresentedVariableData from './test-data/RepresentedVariableData.json'

const { errorString, language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const testDomain = getDomainRef(RepresentedVariable)
const testDomainNameData = RepresentedVariableData[0].name
const testDomainInstanceId = RepresentedVariableData[0].id
const testLink = `${testDomain}/${testDomainInstanceId}`

const setup = () => {
  const { getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <MemoryRouter>
          <DomainLinkResolve link={testLink} />
        </MemoryRouter>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByText }
}

test('Loads', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: true, error: null }])
  setup()

  expect(useAxios).toHaveBeenCalledWith(`${apiContext.restApi}${API.GET_DOMAIN_INSTANCE_NAME(testLink)}`)
})

test('Renders', () => {
  useAxios.mockReturnValue([{ data: testDomainNameData, loading: false, error: null }])
  const { getByText } = setup()

  expect(getByText(getLocalizedGsimObjectText(language, testDomainNameData))).toBeInTheDocument()
})

test('Shows error on error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorString }])
  const { getByText } = setup()

  expect(getByText(testLink, { exact: false })).toBeInTheDocument()
})

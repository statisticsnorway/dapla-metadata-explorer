import React from 'react'
import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getLocalizedGsimObjectText, truncateString } from '@statisticsnorway/dapla-js-utilities'

import { DomainLinkResolve } from '../components/domain'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../configurations'

import UnitTypeAllData from './test-data/UnitTypeAllData.json'

const { errorString, language, apiContext } = TEST_CONFIGURATIONS

const domain = 'UnitType'
const domainName = UnitTypeAllData[2].name
const testLink = `${domain}/${UnitTypeAllData[2].id}`
const context = apiContext(window._env.REACT_APP_EXPLORATION_LDS, jest.fn(), jest.fn(), jest.fn(), jest.fn())

const setup = () => {
  const { getByText } = render(
    <ApiContext.Provider value={context}>
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

  expect(useAxios).toHaveBeenCalledWith(`${context.ldsApi}${API.GET_DOMAIN_INSTANCE_NAME(testLink)}`)
})

test('Renders', () => {
  useAxios.mockReturnValue([{ data: domainName, loading: false, error: null }])
  const { getByText } = setup()

  expect(getByText(getLocalizedGsimObjectText(language, domainName))).toBeInTheDocument()
})

test('Shows error on error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorString }])
  const { getByText } = setup()

  expect(getByText(truncateString(testLink), { exact: false })).toBeInTheDocument()
})

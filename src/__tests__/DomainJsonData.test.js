import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import DomainJsonData from '../components/domain/DomainJsonData'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'
import { DOMAIN } from '../enums'
import UnitTypeAllData from './test-data/UnitTypeAllData.json'

global.URL.createObjectURL = jest.fn()

const { language, otherLanguage, apiContext } = TEST_CONFIGURATIONS

const domain = 'UnitType'

const setup = (setLanguage, setApiReadOnly) => {
  const { getAllByText, getByPlaceholderText, getByTestId, getByText, queryAllByText } = render(
    <ApiContext.Provider
      value={apiContext(window._env.REACT_APP_CONCEPT_LDS, jest.fn(), jest.fn(), jest.fn(), jest.fn(), setApiReadOnly)}>
      <LanguageContext.Provider value={{ language: setLanguage }}>
        <DomainJsonData domain={domain} rawData={UnitTypeAllData} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getAllByText, getByPlaceholderText, getByTestId, getByText, queryAllByText }
}

test('Renders basics', () => {
  const { getByText } = setup(language, false)

  expect(getByText(DOMAIN.GET_JSON[language])).toBeInTheDocument()
})

test('Download file', () => {
  const spy = jest.spyOn(document, 'createElement')
  const { getByText } = setup(language, false)

  userEvent.click(getByText(DOMAIN.GET_JSON[language]))

  expect(spy).toHaveBeenNthCalledWith(4, 'a')

  spy.mockRestore()
})

test('Download file english', () => {
  const spy = jest.spyOn(document, 'createElement')
  const { getByText } = setup(otherLanguage, false)

  userEvent.click(getByText(DOMAIN.GET_JSON[otherLanguage]))

  expect(spy).toHaveBeenNthCalledWith(4, 'a')

  spy.mockRestore()
})

test('Doesnt execute file download', () => {
  const spy = jest.spyOn(document, 'createElement')
  const { getByText } = setup(otherLanguage, true)

  userEvent.click(getByText(DOMAIN.GET_JSON[otherLanguage]))

  expect(spy).toHaveBeenCalledTimes(3)
  expect(spy).not.toHaveBeenCalledWith('a')

  spy.mockRestore()
})

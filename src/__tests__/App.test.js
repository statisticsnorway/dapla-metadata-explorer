import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

import App from '../App'
import { AppContextProvider } from '../utilities'
import { API, TEST_CONFIGURATIONS } from '../configurations'
import { SETTINGS, TEST_IDS, UI } from '../enums'

jest.mock('../components/AppHome', () => () => null)
jest.mock('../components/domain/Domain', () => () => null)
jest.mock('../components/domain/DomainInstance', () => () => null)
jest.mock('../components/domain/DomainInstanceNew', () => () => null)

global.console = {
  log: jest.fn()
}

const { errorObject, language, otherLanguage } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByTestId, getByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getByTestId, getByText }
}

describe('Common mock', () => {
  useAxios.mockReturnValue([{ data: [], loading: false, error: null }])

  test('Renders basics', () => {
    const { getByText } = setup()

    expect(getByText(UI.HEADER[language])).toBeInTheDocument()
  })

  test('Change language works correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText(LANGUAGE.ENGLISH[language]))

    expect(getByText(UI.HEADER[otherLanguage])).toBeInTheDocument()
  })

  test('Opens settings', () => {
    const { getByTestId, getByText } = setup()

    userEvent.click(getByTestId(TEST_IDS.ACCESS_SETTINGS_BUTTON))

    expect(getByText(SETTINGS.HEADER[language])).toBeInTheDocument()
  })
})

test('Does not crash', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: true, error: null }])
  setup()

  expect(useAxios).toHaveBeenCalledWith(`${process.env.REACT_APP_API}${API.GET_SCHEMAS}`, { useCache: false })
})

test('Does not crash on sortSchema problems', () => {
  useAxios.mockReturnValue([{ data: 'Invalid schemas', loading: false, error: null }])
  setup()

  expect(global.console.log).toHaveBeenCalledWith('Could not set schemas: TypeError: schemas.find is not a function')
})

test('Renders error when api returns error', () => {
  useAxios.mockReturnValue([{ data: undefined, loading: false, error: errorObject }])
  const { getByText } = setup()

  expect(getByText(UI.API_ERROR_MESSAGE[language])).toBeInTheDocument()
})

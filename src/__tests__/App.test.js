import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

import App from '../App'
import { AppContextProvider } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'
import { SETTINGS, TEST_IDS, UI } from '../enums'

import Schemas from './test-data/Schemas.json'

jest.mock('../components/AppHome', () => () => null)
jest.mock('../components/domain/Domain', () => () => null)
jest.mock('../components/domains/Import', () => () => null)
jest.mock('../components/domain/DomainInstance', () => () => null)
jest.mock('../components/domain/DomainInstanceNew', () => () => null)

const { language, otherLanguage, errorString } = TEST_CONFIGURATIONS

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
  beforeEach(() => {
    useAxios.mockReturnValue([{ loading: false, error: undefined, data: Schemas }])
  })

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

test('Loads', () => {
  useAxios.mockReturnValue([{ loading: true, error: undefined, data: undefined }])

  setup()
})

test('Shows error', () => {
  useAxios.mockReturnValue([{ loading: false, error: errorString, data: undefined }])

  const { getByText } = setup()

  expect(getByText(UI.API_ERROR_MESSAGE[language])).toBeInTheDocument()
})

test('Handles undefined data', () => {
  useAxios.mockReturnValue([{ loading: false, error: undefined, data: undefined }])

  setup()
})

test('Handles errors in schema sorting', () => {
  useAxios.mockReturnValue([{ loading: false, error: undefined, data: {} }])

  setup()
})

import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import { AppSettings } from '../components'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'
import { SETTINGS, TEST_IDS } from '../enums'

const { alternativeApi, language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn(), jest.fn())

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppSettings error={null} loading={false} open={true} setSettingsOpen={jest.fn()} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText }
}

test('Renders correctly', () => {
  const { getByPlaceholderText } = setup()

  expect(getByPlaceholderText(SETTINGS.API[language])).toHaveValue(apiContext.restApi)
})

test('Editing works correctly', async () => {
  const { getByPlaceholderText, getByText } = setup()

  await userEvent.type(getByPlaceholderText(SETTINGS.API[language]), alternativeApi)

  expect(getByText(SETTINGS.EDITED_VALUES[language])).toBeInTheDocument()

  userEvent.click(getByText(SETTINGS.APPLY[language]))

  expect(apiContext.setRestApi).toHaveBeenCalled()
  expect(apiContext.setGraphqlApi).toHaveBeenCalled()
})

test('Resetting to default values works correctly', async () => {
  const { getByPlaceholderText, getByTestId } = setup()

  await userEvent.type(getByPlaceholderText(SETTINGS.API[language]), alternativeApi)

  userEvent.click(getByTestId(TEST_IDS.DEFAULT_SETTINGS_BUTTON))

  expect(getByPlaceholderText(SETTINGS.API[language])).toHaveValue(apiContext.restApi)
})

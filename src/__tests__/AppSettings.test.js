import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppSettings } from '../components'
import { ApiContext, LanguageContext, UserContext } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'
import { SETTINGS, TEST_IDS } from '../enums'

const { language, apiContext, userContext } = TEST_CONFIGURATIONS
const setUser = jest.fn()
const setLdsApi = jest.fn()
const setGraphqlApi = jest.fn()
const setApiReadOnly = jest.fn()
const setShowUnnamed = jest.fn()

const setup = initialApi => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <UserContext.Provider value={userContext(setUser)}>
      <ApiContext.Provider value={apiContext(initialApi, setLdsApi, setApiReadOnly, setGraphqlApi, setShowUnnamed)}>
        <LanguageContext.Provider value={{ language: language }}>
          <MemoryRouter initialEntries={['/']}>
            <AppSettings error={undefined} loading={false} open={true} setOpen={jest.fn()} />
          </MemoryRouter>
        </LanguageContext.Provider>
      </ApiContext.Provider>
    </UserContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText }
}

test('Renders basics', () => {
  const { getByText } = setup(window.__ENV.REACT_APP_EXPLORATION_LDS)

  expect(getByText(SETTINGS.HEADER[language])).toBeInTheDocument()
})

test('Changing user works correctly', () => {
  const { getByPlaceholderText } = setup(window.__ENV.REACT_APP_EXPLORATION_LDS)

  userEvent.clear(getByPlaceholderText(SETTINGS.USER[language])) // 1 call
  userEvent.type(getByPlaceholderText(SETTINGS.USER[language]), 'MMJ') // 1 call per character

  expect(setUser).toHaveBeenCalledTimes(4) // total calls to setUser()
})

test('Changing API to CONCEPT_LDS works correctly', () => {
  const { getByText } = setup(window.__ENV.REACT_APP_EXPLORATION_LDS)

  userEvent.click(getByText(window.__ENV.REACT_APP_CONCEPT_LDS))

  expect(setLdsApi).toHaveBeenCalledWith(window.__ENV.REACT_APP_CONCEPT_LDS)
  expect(setApiReadOnly).toHaveBeenCalledWith(false)
})

test('Changing API to EXPLORATION_LDS works correctly', () => {
  const { getByText } = setup(window.__ENV.REACT_APP_CONCEPT_LDS)

  userEvent.click(getByText(window.__ENV.REACT_APP_EXPLORATION_LDS))

  expect(setLdsApi).toHaveBeenCalledWith(window.__ENV.REACT_APP_EXPLORATION_LDS)
  expect(setApiReadOnly).toHaveBeenCalledWith(true)
})

test('Changing show unnamed works correctly', () => {
  const { getByTestId } = setup(window.__ENV.REACT_APP_CONCEPT_LDS)

  userEvent.click(getByTestId(TEST_IDS.SHOW_UNNAMED_RESOURCES_TOGGLE))

  expect(setShowUnnamed).toHaveBeenCalledWith(true)
})

import React from 'react'
import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import { DomainInstanceDelete } from '../components/domain'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { camelToTitle } from '../utilities'
import { API, TEST_CONFIGURATIONS } from '../configurations'
import { DOMAIN } from '../enums'

const { language, apiContext, errorObject } = TEST_CONFIGURATIONS

const setWasDeleted = jest.fn()
const executeDelete = jest.fn()
const domain = 'Population'
const domainId = 'dfb6eecf-c4f4-4fa6-82a1-8b8684d560f4c'

const setup = () => {
  const { getAllByText, getByText } = render(
    <ApiContext.Provider
      value={apiContext(window.__ENV.REACT_APP_EXPLORATION_LDS, jest.fn(), jest.fn(), jest.fn(), jest.fn())}>
      <LanguageContext.Provider value={{ language: language }}>
        <DomainInstanceDelete domain={domain} id={domainId} wasDeleted={false} setWasDeleted={setWasDeleted} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getAllByText, getByText }
}

test('Renders basics', () => {
  useAxios.mockReturnValue([{ loading: false, error: undefined, response: undefined }, executeDelete])

  const { getByText } = setup()

  userEvent.click(getByText(DOMAIN.DELETE[language]))

  expect(getByText(DOMAIN.DELETE_HEADER(camelToTitle(domain))[language])).toBeInTheDocument()
  expect(getByText(DOMAIN.DELETE_CONFIRM_MESSAGE[language])).toBeInTheDocument()

  userEvent.click(getByText(DOMAIN.CANCEL_DELETE[language]))
})

test('Shows delete confirmation on successful deletion', () => {
  useAxios
    .mockReturnValue([{ loading: false, error: undefined, response: undefined }, executeDelete])
    .mockReturnValueOnce([{ loading: false, error: undefined, response: { status: 200 } }, executeDelete])

  const { getByText } = setup()

  userEvent.click(getByText(DOMAIN.DELETE[language]))
  userEvent.click(getByText(DOMAIN.CONFIRM_DELETE[language]))
  expect(useAxios).toHaveBeenCalledWith(
    {
      url: `${window.__ENV.REACT_APP_EXPLORATION_LDS}${API.DELETE_DOMAIN_INSTANCE_DATA(domain, domainId)}`,
      method: 'DELETE'
    },
    {
      manual: true,
      useCache: false
    }
  )
  expect(useAxios).toHaveBeenCalledTimes(2)
  expect(executeDelete).toHaveBeenCalledTimes(1)
  expect(setWasDeleted).toHaveBeenCalledWith(true)
})

test('Shows error on unsuccessful deletion', () => {
  useAxios
    .mockReturnValue([{ loading: false, error: undefined, response: undefined }, executeDelete])
    .mockReturnValueOnce([{ loading: false, error: errorObject, response: undefined }, executeDelete])

  const { getByText } = setup()

  userEvent.click(getByText(DOMAIN.DELETE[language]))
  userEvent.click(getByText(DOMAIN.CONFIRM_DELETE[language]))

  expect(setWasDeleted).not.toHaveBeenCalled()
})

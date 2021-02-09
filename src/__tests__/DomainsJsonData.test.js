import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import DomainsJsonData from '../components/domains/DomainsJsonData'
import { ApiContext, LanguageContext, SchemasContext } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'
import { DOMAINS } from '../enums'
import { sortSchemas } from '../utilities'
import Schemas from './test-data/Schemas.json'
import useAxios from 'axios-hooks'

let JSZip = require('jszip')

global.URL.createObjectURL = jest.fn()

const { language, otherLanguage, apiContext } = TEST_CONFIGURATIONS

const sortedSchemas = sortSchemas(Schemas)

const refetch = jest.fn(() => Promise.resolve({ data: [], status: 200}))
const mockFile = jest.fn()
const mockGenerateAsync = jest.fn(() => Promise.resolve(new Blob()))
JSZip.file = mockFile
JSZip.generateAsync = mockGenerateAsync

const setup = (setLanguage, setApiReadOnly) => {
  const { getAllByText, getByPlaceholderText, getByTestId, getByText, queryAllByText } = render(
    <ApiContext.Provider
      value={apiContext(window._env.REACT_APP_CONCEPT_LDS, jest.fn(), jest.fn(), jest.fn(), jest.fn(), setApiReadOnly)}>
      <LanguageContext.Provider value={{ language: setLanguage }}>
        <SchemasContext.Provider value={{ schemas: sortedSchemas }}>
          <DomainsJsonData />
        </SchemasContext.Provider>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getAllByText, getByPlaceholderText, getByTestId, getByText, queryAllByText }
}

test('Renders basics', () => {
  useAxios.mockReturnValue([{ loading: false }, refetch])
  const { getByText } = setup(language, false)

  expect(getByText(DOMAINS.GET_ZIP[language])).toBeInTheDocument()
})

test('Download file', async () => {
  useAxios.mockReturnValue([{ loading: false }, await refetch])

  const spy = jest.spyOn(document, 'createElement')
  const { getByText } = setup(language, false)

  userEvent.click(getByText(DOMAINS.GET_ZIP[language]))

  await mockGenerateAsync

  await expect(spy).toHaveBeenNthCalledWith(4, 'a')

  spy.mockRestore()
})

test('Download file english', () => {
  useAxios.mockReturnValue([{ loading: false }, refetch])
  const spy = jest.spyOn(document, 'createElement')
  const { getByText } = setup(otherLanguage, false)

  userEvent.click(getByText(DOMAINS.GET_ZIP[otherLanguage]))

  expect(spy).toHaveBeenNthCalledWith(4, 'a')

  spy.mockRestore()
})

test('Doesnt execute file download', () => {
  useAxios.mockReturnValue([{ loading: false }, refetch])
  const spy = jest.spyOn(document, 'createElement')
  const { getByText } = setup(otherLanguage, true)

  userEvent.click(getByText(DOMAINS.GET_ZIP[otherLanguage]))

  expect(spy).toHaveBeenCalledTimes(3)
  expect(spy).not.toHaveBeenCalledWith('a')

  spy.mockRestore()
})

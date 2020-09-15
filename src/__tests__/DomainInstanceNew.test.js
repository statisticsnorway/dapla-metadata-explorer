import React from 'react'
import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { DomainInstanceNew } from '../components/domain'
import { ApiContext, LanguageContext, SchemasContext } from '../context/AppContext'
import { getDomainDisplayName, getDomainRef, sortSchemas } from '../utilities'
import { ROUTING, TEST_CONFIGURATIONS } from '../configurations'
import { DOMAIN } from '../enums'

import RepresentedVariable from './test-data/RepresentedVariable.json'
import userEvent from '@testing-library/user-event'

// https://stackoverflow.com/questions/58117890/how-to-test-components-using-new-react-router-hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    domain: 'RepresentedVariable',
    id: 'new'
  })
}))

const { errorString, language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())
const executePut = jest.fn()
const testDomain = getDomainRef(RepresentedVariable)

const setup = () => {
  const { getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <SchemasContext.Provider value={{ schemas: sortSchemas([RepresentedVariable]) }}>
          <MemoryRouter initialEntries={[`${ROUTING.DOMAIN_BASE}${testDomain}/new`]}>
            <DomainInstanceNew />
          </MemoryRouter>
        </SchemasContext.Provider>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByText }
}

test('Renders', () => {
  useAxios.mockReturnValue([{ loading: false, error: null, response: undefined }, executePut])
  const { getByText } = setup()

  expect(getByText(getDomainDisplayName(RepresentedVariable))).toBeInTheDocument()
})

test('Initiates save on pressing save button', () => {
  useAxios.mockReturnValue([{ loading: false, error: null, response: undefined }, executePut])
  const { getByText } = setup()

  userEvent.click(getByText(DOMAIN.SAVE[language]))

  expect(executePut).toHaveBeenCalled()
})

test('Shows error on error', () => {
  useAxios.mockReturnValue([{ response: undefined, loading: false, error: errorString }, executePut])
  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})

test('Shows success on success', () => {
  useAxios.mockReturnValue([{ response: { status: 201 }, loading: false, error: undefined }, executePut])
  const { getByText } = setup()

  expect(getByText(DOMAIN.WAS_SAVED[language])).toBeInTheDocument()
})

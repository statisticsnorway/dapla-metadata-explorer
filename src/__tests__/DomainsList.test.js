import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { DomainsList } from '../components/domains'
import { SchemasContext } from '../context/AppContext'
import { sortSchemas } from '../utilities'
import { GSIM } from '../configurations'

import Schemas from './test-data/Schemas.json'

const sortedSchemas = sortSchemas(Schemas)
const modelObject = getNestedObject(Schemas[11], ['definitions', 'Variable', 'description'])

const setup = () => {
  const { getByText } = render(
    <SchemasContext.Provider value={{ schemas: sortedSchemas }}>
      <MemoryRouter initialEntries={['/']}>
        <DomainsList />
      </MemoryRouter>
    </SchemasContext.Provider>
  )

  return { getByText }
}

test('Renders basics', () => {
  const { getByText } = setup()

  Object.keys(GSIM.GROUPS).filter(group => group === 'CONCEPT').forEach(group => {
    const lsGroup = group.toLowerCase()

    expect(getByText(lsGroup.charAt(0).toUpperCase() + lsGroup.slice(1))).toBeInTheDocument()
  })
})

test('Opens correct pane', () => {
  const { getByText } = setup()
  const lsGroup = Object.keys(GSIM.GROUPS)[2].toLowerCase()

  userEvent.click(getByText(lsGroup.charAt(0).toUpperCase() + lsGroup.slice(1)))

  expect(getByText(modelObject)).toBeInTheDocument()
})

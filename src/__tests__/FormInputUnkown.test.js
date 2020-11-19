import React from 'react'
import { render } from '@testing-library/react'

import FormInputUnkown from '../components/form/FormInputUnkown'

const configuration = {
  configuration: {
    name: 'unkownFormInput'
  }
}

const setup = () => {
  const { getByText } = render(<FormInputUnkown {...configuration} />)

  return { getByText }
}

test('Behaves correctly', () => {
  const { getByText } = setup()

  expect(getByText('Not handled yet!')).toBeInTheDocument()
})

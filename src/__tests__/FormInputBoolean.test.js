import React from 'react'
import { render } from '@testing-library/react'

import FormInputBoolean from '../components/form/FormInputBoolean'

const configuration = {
  register: jest.fn(),
  setValue: jest.fn(),
  configuration: {
    name: 'isExternal',
    configuration: {
      inputType: 'boolean',
      value: false,
    },
    required: false
  },
  value: false
}

const setup = () => {
  return render(<FormInputBoolean {...configuration} />)
}

test('Behaves correctly', () => {
  setup()
})

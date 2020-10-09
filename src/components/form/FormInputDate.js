import React from 'react'
import { Form } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

function FormInputDate ({ configuration }) {
  return (
    <Form.Input
      disabled={configuration.configuration.options.multiple}
      icon={{ name: 'calendar alternate outline', style: { color: SSB_COLORS.PURPLE } }}
      iconPosition='left'
      type='date'
      placeholder={configuration.name}>
    </Form.Input>
  )
}

export default FormInputDate

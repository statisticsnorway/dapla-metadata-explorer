import React from 'react'
import { Form } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

function FormInputNumber ({ configuration }) {
  return (
    <Form.Input
      icon={{ name: 'hashtag', style: { color: SSB_COLORS.PURPLE } }}
      iconPosition='left'
      type='number'
      placeholder={configuration.name}>
    </Form.Input>
  )
}

export default FormInputNumber

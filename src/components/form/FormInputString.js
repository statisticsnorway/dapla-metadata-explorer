import React from 'react'
import { Form } from 'semantic-ui-react'

function FormInputString ({ configuration }) {
  return (
    <Form.Input placeholder={configuration.name} />
  )
}

export default FormInputString

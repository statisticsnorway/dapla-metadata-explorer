import React from 'react'
import { Form } from 'semantic-ui-react'

function FormInputUnkown ({ configuration }) {
  return (
    <>
      <span style={{ color: 'red' }}>Not handled yet!</span>
      <Form.Input disabled placeholder={configuration.name} />
    </>
  )
}

export default FormInputUnkown

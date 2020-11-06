import React from 'react'
import { Form } from 'semantic-ui-react'

function FormKeyValuesInput ({ configuration }) {
  return (
    <Form.Group>
      <Form.Select
        disabled
        width={6}
        clearable
        placeholder={configuration.configuration.options.key.name}
        options={configuration.configuration.options.key.values.map(value => ({
          key: value,
          text: value,
          value: value
        }))}
      />
      <Form.Input disabled width={10} placeholder={configuration.configuration.options.value.name} />
    </Form.Group>
  )
}

export default FormKeyValuesInput

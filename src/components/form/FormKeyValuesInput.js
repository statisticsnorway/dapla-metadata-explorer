import React, { useEffect } from 'react'
import { Form } from 'semantic-ui-react'

function FormKeyValuesInput ({ configuration }) {
  useEffect(() => {
    console.log(configuration)
  }, [])

  return (
    <Form.Group>
      <Form.Select
        width={6}
        clearable
        options={configuration.configuration.options.key.values.map(value => ({
          key: value,
          text: value,
          value: value
        }))}
        placeholder={configuration.configuration.options.key.name}
      />
      <Form.Input width={10} placeholder={configuration.configuration.options.value.name} />
    </Form.Group>
  )
}

export default FormKeyValuesInput

import React, { useEffect } from 'react'
import { Form } from 'semantic-ui-react'

function FormKeyValuesInput ({ configuration }) {
  useEffect(() => {
    console.log(configuration)
  }, [configuration])

  return (
    <Form.Group>
      <Form.Select
        disabled
        width={6}
        clearable
        options={configuration.configuration.options.key.values.map(value => ({
          key: value,
          text: value,
          value: value
        }))}
        placeholder={configuration.configuration.options.key.name}
      />
      <Form.Input disabled width={10} placeholder={configuration.configuration.options.value.name} />
    </Form.Group>
  )
}

export default FormKeyValuesInput

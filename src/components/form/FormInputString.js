import React, { useEffect } from 'react'
import { Form } from 'semantic-ui-react'

function FormInputString ({ configuration, register, setValue, value }) {
  const name = configuration.partOfMultiple ? `${configuration.partOfMultiple}.${configuration.name}` : configuration.name

  const handleChange = (e, { value }) => {
    setValue(name, value, { shouldDirty: true })
  }

  useEffect(() => {
    register(name)
  }, [register, name])

  return (
    <Form.Input placeholder={configuration.name} onChange={handleChange} defaultValue={value ? value : ''} />
  )
}

export default FormInputString

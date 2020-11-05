import React, { useEffect } from 'react'
import { Form } from 'semantic-ui-react'

function FormInputString ({ configuration, register, setValue }) {
  const handleChange = (e, { value }) => {
    setValue(configuration.name, value, { shouldDirty: true })
  }

  useEffect(() => {
    register(configuration.name)
  }, [register, configuration.name])

  return (
    <Form.Input placeholder={configuration.name} onChange={handleChange} />
  )
}

export default FormInputString

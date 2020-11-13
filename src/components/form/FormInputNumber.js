import React, { useEffect } from 'react'
import { Form } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

function FormInputNumber ({ configuration, register, setValue }) {
  const handleChange = (e, { value }) => {
    setValue(configuration.name, value, { shouldDirty: true })
  }

  useEffect(() => {
    register(configuration.name)
  }, [register, configuration.name])

  return (
    <Form.Input
      type='number'
      iconPosition='left'
      onChange={handleChange}
      placeholder={configuration.name}
      icon={{ name: 'hashtag', style: { color: SSB_COLORS.BLUE } }}
    />
  )
}

export default FormInputNumber

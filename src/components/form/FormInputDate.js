import React, { useEffect } from 'react'
import { Form } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

function FormInputDate ({ configuration, register, setValue, value }) {
  const handleChange = (e, { value }) => {
    setValue(configuration.name, new Date(value).toISOString(), { shouldDirty: true })
  }

  useEffect(() => {
    register(configuration.name)
  }, [register, configuration.name])

  return (
    <Form.Input
      type='date'
      iconPosition='left'
      onChange={handleChange}
      placeholder={configuration.name}
      defaultValue={value ? value.split('T')[0] : ''}
      disabled={configuration.configuration.options.multiple}
      icon={{ name: 'calendar alternate outline', style: { color: SSB_COLORS.BLUE } }}
    />
  )
}

export default FormInputDate

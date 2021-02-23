import React, { useEffect } from 'react'
import { Form } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

function FormInputDate ({ configuration, register, setValue, value, defaultValue }) {
  const name = configuration.partOfMultiple ? `${configuration.partOfMultiple}.${configuration.name}` : configuration.name

  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate())
  defaultValue = currentDate.toISOString().substr(0,10)

  const handleChange = (e, { value }) => {
    setValue(name, new Date(value).toISOString(), { shouldDirty: true })
  }

  useEffect(() => {
    register(name)
  }, [register, name])

  return (
    <Form.Input
      type='date'
      iconPosition='left'
      onChange={handleChange}
      placeholder={configuration.name}
      disabled={configuration.configuration.options.multiple}
      defaultValue={value ? value.split('T')[0] : defaultValue}
      icon={{ name: 'calendar alternate outline', style: { color: SSB_COLORS.BLUE } }}
    />
  )
}

export default FormInputDate

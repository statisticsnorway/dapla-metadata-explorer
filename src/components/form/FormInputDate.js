import React, { useEffect } from 'react'
import { Form } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

function FormInputDate ({ configuration, register, setValue, value }) {
  const name = configuration.partOfMultiple ? `${configuration.partOfMultiple}.${configuration.name}` : configuration.name

  const handleChange = (e, { value }) => {
    let tempDate = null

    try {
      tempDate = new Date(value).toISOString()
    } catch (e) {

    }

    setValue(name, tempDate, { shouldDirty: true })
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
      defaultValue={value ? value.split('T')[0] : ''}
      disabled={configuration.configuration.options.multiple}
      icon={{ name: 'calendar alternate outline', style: { color: SSB_COLORS.BLUE } }}
    />
  )
}

export default FormInputDate

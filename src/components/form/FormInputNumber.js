import React, { useEffect } from 'react'
import { Form } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

function FormInputNumber ({ configuration, register, setValue, value }) {
  const name = configuration.partOfMultiple ? `${configuration.partOfMultiple}.${configuration.name}` : configuration.name

  const handleChange = (e, { value }) => {
    setValue(name, parseInt(value, 10), { shouldDirty: true })
  }

  useEffect(() => {
    register(name)
  }, [register, name])

  return (
    <Form.Input
      type='number'
      iconPosition='left'
      onChange={handleChange}
      placeholder={configuration.name}
      defaultValue={value ? value : ''}
      icon={{ name: 'hashtag', style: { color: SSB_COLORS.BLUE } }}
    />
  )
}

export default FormInputNumber

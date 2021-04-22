import React, { useEffect, useState } from 'react'
import { Form } from 'semantic-ui-react'

function FormInputDate ({ configuration, register, setValue, value }) {
  const [date, setDate] = useState(value ? value.split('T')[0] : '')

  const name = configuration.partOfMultiple ? `${configuration.partOfMultiple}.${configuration.name}` : configuration.name

  const handleChange = (e, { value }) => {
    let tempDate = null

    try {
      tempDate = new Date(value).toISOString()
    } catch (e) {

    }

    setDate(value)
    setValue(name, tempDate, { shouldDirty: true })
  }

  useEffect(() => {
    register(name)
  }, [register, name])

  return (
    <Form.Input
      inline
      type='date'
      value={date}
      onChange={handleChange}
      placeholder={configuration.name}
      disabled={configuration.configuration.options.multiple}
      action={{
        basic: true,
        icon: 'close',
        type: 'button',
        onClick: () => {
          handleChange(null, { value: '' })
        }
      }}
    />
  )
}

export default FormInputDate

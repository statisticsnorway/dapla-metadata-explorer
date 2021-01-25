import React, { useEffect } from 'react'
import { Checkbox } from 'semantic-ui-react'

function FormInputBoolean ({ configuration, register, setValue, value }) {
  const name = configuration.partOfMultiple ? `${configuration.partOfMultiple}.${configuration.name}` : configuration.name

  const handleChange = (e, { checked }) => {
    setValue(name, checked, { shouldDirty: true })
  }

  useEffect(() => {
    register(name)
  }, [register, name])

  return (
    <Checkbox toggle onChange={handleChange} defaultChecked={value ? value : false} />
  )
}

export default FormInputBoolean

import React, { useEffect } from 'react'
import { Checkbox } from 'semantic-ui-react'

function FormInputBoolean ({ configuration, register, setValue, value }) {
  const handleChange = (e, { checked }) => {
    setValue(configuration.name, checked, { shouldDirty: true })
  }

  useEffect(() => {
    register(configuration.name)
  }, [register, configuration.name])

  return (
    <Checkbox toggle onChange={handleChange} defaultChecked={value ? value : false} />
  )
}

export default FormInputBoolean

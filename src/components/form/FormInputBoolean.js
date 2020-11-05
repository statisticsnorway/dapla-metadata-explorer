import React, { useEffect } from 'react'
import { Checkbox } from 'semantic-ui-react'

function FormInputBoolean ({ configuration, register, setValue }) {
  const handleChange = (e, { checked }) => {
    setValue(configuration.name, checked, { shouldDirty: true })
  }

  useEffect(() => {
    register(configuration.name)
  }, [register, configuration.name])

  return (
    <Checkbox toggle onChange={handleChange} />
  )
}

export default FormInputBoolean

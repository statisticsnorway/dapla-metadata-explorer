import React, { useContext, useEffect, useState } from 'react'
import { Form, Tab } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'

function FormKeyValueInput ({ configuration, register, setValue }) {
  const { language } = useContext(LanguageContext)

  const [defaultActiveIndex, setDefaultActiveIndex] = useState(1)

  const handleChange = (e, { value }, key) => {
    setValue(configuration.name, [{ languageCode: key, languageText: value }], { shouldDirty: true })
  }

  useEffect(() => {
    configuration.configuration.options.key.values.forEach((value, index) => {
      if (language === value) {
        setDefaultActiveIndex(index)
      }
    })
  }, [language, configuration.configuration.options.key.values])

  useEffect(() => {
    register(configuration.name)
  }, [register, configuration.name])

  const panes = configuration.configuration.options.key.values.map(value =>
    ({
      menuItem: value,
      pane: {
        key: value,
        content: (
          <Form.TextArea
            placeholder={configuration.configuration.options.value.name}
            onChange={(e, data) => handleChange(e, data, value)}
          />
        )
      }
    })
  )

  return (
    <Tab panes={panes} renderActiveOnly={false} defaultActiveIndex={defaultActiveIndex} />
  )
}

export default FormKeyValueInput

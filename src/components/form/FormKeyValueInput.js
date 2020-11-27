import React, { useContext, useEffect, useState } from 'react'
import { Form, Tab } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'

function FormKeyValueInput ({ configuration, register, setValue, value }) {
  const { language } = useContext(LanguageContext)

  const [defaultActiveIndex, setDefaultActiveIndex] = useState(1)

  const handleChange = (e, data, key) => {
    const keyName = configuration.configuration.options.key.name
    const valueName = configuration.configuration.options.value.name

    const objectIndex = value.findIndex((object => object[keyName] === key))

    if (objectIndex === -1) {
      value.push({ [keyName]: key, [valueName]: data.value })
    } else {
      if (data.value === '') {
        value.splice(objectIndex, 1)
      } else {
        value[objectIndex][valueName] = data.value
      }
    }

    setValue(configuration.name, value, { shouldDirty: true })
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

  const panes = configuration.configuration.options.key.values.map(keyValue =>
    ({
      menuItem: keyValue,
      pane: {
        key: keyValue,
        content: (
          <Form.TextArea
            defaultValue={
              value ?
                value.filter(object => object[configuration.configuration.options.key.name] === keyValue).length !== 0 ?
                  value.filter(object => object[configuration.configuration.options.key.name] === keyValue)[0].languageText
                  : '' : ''
            }
            placeholder={configuration.configuration.options.value.name}
            onChange={(e, data) => handleChange(e, data, keyValue)}
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

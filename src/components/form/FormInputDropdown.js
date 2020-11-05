import React, { useContext, useEffect, useState } from 'react'
import { Form } from 'semantic-ui-react'
import useAxios from 'axios-hooks'
import { getLocalizedGsimObjectText } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../context/AppContext'

function FormInputDropdown ({ configuration, register, setValue }) {
  const { language } = useContext(LanguageContext)
  const [options, setOptions] = useState(configuration.configuration.options.isLink ? [] : configuration.configuration.options.values)

  const [{ loading }, refetch] = useAxios('', { manual: true })

  const handleChange = (e, { value }) => {
    setValue(configuration.name, value, { shouldDirty: true })
  }

  useEffect(() => {
    register(configuration.name)
  }, [register, configuration.name])

  useEffect(() => {
    if (configuration.configuration.options.isLink) {
      let i = 0
      let fetchedOptions = []

      async function myStuff (i) {
        const response = await refetch({ url: `http://localhost:29091/ns/${configuration.configuration.options.links[i]}` })

        fetchedOptions = fetchedOptions.concat(response.data.map(item => ({
          key: `/${configuration.configuration.options.links[i]}/${item.id}`,
          text: `${getLocalizedGsimObjectText(language, item.name)}${configuration.configuration.options.links.length > 1 ? ` (${configuration.configuration.options.links[i]})` : ''}`,
          value: `/${configuration.configuration.options.links[i]}/${item.id}`
        })))
      }

      myStuff(i).then(() => {
          if (configuration.configuration.options.links.length - 1 > i) {
            i++
            myStuff(i).then(() => {
              setOptions(fetchedOptions)
            })
          } else {
            setOptions(fetchedOptions)
          }
        }
      )
    }
  }, [configuration.configuration.options.isLink, configuration.configuration.options.links, refetch])

  return (
    <Form.Select
      loading={loading}
      disabled={loading}
      clearable
      onChange={handleChange}
      options={options}
      multiple={configuration.configuration.options.multiple}
      placeholder={configuration.name}
    />
  )
}

export default FormInputDropdown

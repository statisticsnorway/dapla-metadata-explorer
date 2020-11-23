import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Form, Header } from 'semantic-ui-react'
import { getLocalizedGsimObjectText } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../../context/AppContext'

function FormInputDropdown ({ configuration, register, setValue, value }) {
  const { ldsApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [options, setOptions] = useState(configuration.configuration.options.isLink ? [] : configuration.configuration.options.values)

  const [{ loading }, refetch] = useAxios('', { manual: true, useCache: false })

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

      async function fetchOptions (i) {
        const response = await refetch({ url: `${ldsApi}/ns/${configuration.configuration.options.links[i]}` })

        fetchedOptions = fetchedOptions.concat(response.data.map(item => ({
          key: `/${configuration.configuration.options.links[i]}/${item.id}`,
          text: `${getLocalizedGsimObjectText(language, item.name)}${configuration.configuration.options.links.length > 1 ? ` (${configuration.configuration.options.links[i]})` : ''}`,
          value: `/${configuration.configuration.options.links[i]}/${item.id}`,
          content: (
            <Header
              size='small'
              content={getLocalizedGsimObjectText(language, item.name)}
              subheader={getLocalizedGsimObjectText(language, item.description)}
            />
          )
        })))
      }

      fetchOptions(i).then(() => {
          if (configuration.configuration.options.links.length - 1 > i) {
            i++
            fetchOptions(i).then(() => {
              setOptions(fetchedOptions)
            })
          } else {
            setOptions(fetchedOptions)
          }
        }
      )
    }
  }, [configuration.configuration.options.isLink, configuration.configuration.options.links, refetch, ldsApi, language])

  return (
    <Form.Select
      clearable
      options={options}
      loading={loading}
      disabled={loading}
      onChange={handleChange}
      placeholder={configuration.name}
      defaultValue={value ? value : ''}
      multiple={configuration.configuration.options.multiple}
    />
  )
}

export default FormInputDropdown

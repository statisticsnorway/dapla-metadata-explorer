import React, { useEffect, useState } from 'react'
import { Form } from 'semantic-ui-react'
import useAxios from 'axios-hooks'
import { getLocalizedGsimObjectText } from '@statisticsnorway/dapla-js-utilities'

function FormInputDropdown ({ configuration }) {
  const [options, setOptions] = useState(configuration.configuration.options.isLink ? [] : configuration.configuration.options.values)

  const [{ loading }, refetch] = useAxios('', { manual: true })

  useEffect(() => {
    if (configuration.configuration.options.isLink) {
      let i = 0
      let fetchedOptions = []

      async function myStuff (i) {
        const response = await refetch({ url: `http://localhost:29091/ns/${configuration.configuration.options.links[i]}` })

        fetchedOptions = fetchedOptions.concat(response.data.map(item => ({
          key: item.id,
          text: `${getLocalizedGsimObjectText('nb', item.name)}${configuration.configuration.options.links.length > 1 ? ` (${configuration.configuration.options.links[i]})` : ''}`,
          value: item.id
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
      options={options}
      multiple={configuration.configuration.options.multiple}
      placeholder={configuration.name}
    />
  )
}

export default FormInputDropdown

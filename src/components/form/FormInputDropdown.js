import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Form, Header, Item } from 'semantic-ui-react'
import { getLocalizedGsimObjectText } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../../context/AppContext'
import { camelToTitle } from '../../utilities'

function FormInputDropdown ({ configuration, register, setValue, value }) {
  const { ldsApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [options, setOptions] = useState(configuration.configuration.options.isLink ? [] : configuration.configuration.options.values)

  const [{ loading }, refetch] = useAxios('', { manual: true, useCache: false })

  const name = configuration.partOfMultiple ? `${configuration.partOfMultiple}.${configuration.name}` : configuration.name

  const handleChange = (e, { value }) => {
    setValue(name, value, { shouldDirty: true })
  }

  useEffect(() => {
    register(name)
  }, [register, name])

  useEffect(() => {
    if (configuration.configuration.options.isLink) {
      let i = 0
      let fetchedOptions = []

      async function fetchOptions (i) {
        const response = await refetch({ url: `${ldsApi}/ns/${configuration.configuration.options.links[i]}` })

        fetchedOptions = fetchedOptions.concat(response.data
          .sort((a, b) => {
            const aName = getLocalizedGsimObjectText(language, a.name).toUpperCase().replace(/\s/g, '')
            const bName = getLocalizedGsimObjectText(language, b.name).toUpperCase().replace(/\s/g, '')

            if (aName < bName) {
              return -1
            }

            if (aName > bName) {
              return 1
            }

            return 0
          })
          .map(item => ({
            key: `/${configuration.configuration.options.links[i]}/${item.id}`,
            text: `${getLocalizedGsimObjectText(language, item.name)}${
              configuration.configuration.options.links.length > 1 ? ` (${configuration.configuration.options.links[i]})` : ''
            }`,
            value: `/${configuration.configuration.options.links[i]}/${item.id}`,
            content: (
              <Item.Group>
                <Item>
                  <Item.Content>
                    <Item.Header as={Header} size='small'>
                      {getLocalizedGsimObjectText(language, item.name)}
                    </Item.Header>
                    <Item.Description>
                      {getLocalizedGsimObjectText(language, item.description)}
                    </Item.Description>
                    <Item.Extra>
                      {camelToTitle(configuration.configuration.options.links[i])}
                    </Item.Extra>
                  </Item.Content>
                </Item>
              </Item.Group>
            )
          }))
        )
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
      search
      clearable
      options={options}
      loading={loading}
      disabled={loading}
      closeOnChange={true}
      onChange={handleChange}
      placeholder={configuration.name}
      defaultValue={value ? value : ''}
      multiple={configuration.configuration.options.multiple}
    />
  )
}

export default FormInputDropdown

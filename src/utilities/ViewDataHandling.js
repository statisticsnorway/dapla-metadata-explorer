import React from 'react'
import { Icon, List } from 'semantic-ui-react'
import { getNestedObject, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { DomainLinkResolve } from '../components/domain'
import { convertDateToView } from './'
import { GSIM, GSIM_DEFINITIONS } from '../configurations'
import { GSIM_PROPERTY_TYPES } from '../configurations/API'

const NOT_FINISHED = '...'

const handleNumberForView = value => value

export const handleStringForView = (data, format, enumerated, refProperty, language, ldsApi) => {
  if (format !== false) {
    if (format === 'date-time') {
      return convertDateToView(data)
    } else {
      console.log(`Format not handled: ${format}`)
      return data.toString()
    }
  }

  if (enumerated !== false) {
    return data.toString()
  }

  if (refProperty !== false) {
    return data.toString()
  }

  if (data.startsWith('/')) {
    return <DomainLinkResolve language={language} ldsApi={ldsApi} link={data}/>
  }

  if (data.startsWith('http')) {
    return <a target='_blank' rel='noopener noreferrer' href={data}>{data}</a>
  }

  return data.toString()
}

const convertMultilingualToView = value =>
  <List>
    {value.map((element, index) =>
      <List.Item key={index}>
        <List.Content>
          <List.Header style={{ lineHeight: '1.4285em', fontStyle: 'italic' }}>
            {element[GSIM_DEFINITIONS.MULTILINGUAL_TEXT.PROPERTIES.LANGUAGE_CODE]}
          </List.Header>
          <List.Description>
            {element[GSIM_DEFINITIONS.MULTILINGUAL_TEXT.PROPERTIES.LANGUAGE_TEXT]}
          </List.Description>
        </List.Content>
      </List.Item>
    )}
  </List>

export const convertAgentDetailsToView = (language, ldsApi, value) =>
  <List relaxed>
    {value.map((element, index) =>
      <List.Item key={index}>
        <List.Content>
          <List.Header style={{ lineHeight: '1.4285em', fontStyle: 'italic' }}>
            {element[GSIM_DEFINITIONS.AGENT_DETAILS.PROPERTIES.AGENT_DETAIL_TYPE]}
          </List.Header>
          <List.Description>
            <List.List>
              {element[GSIM_DEFINITIONS.AGENT_DETAILS.PROPERTIES.VALUES].map(innerElement =>
                <List.Item key={innerElement}>
                  {handleStringForView(innerElement, false, false, false, language, ldsApi)}
                </List.Item>
              )}
            </List.List>
          </List.Description>
        </List.Content>
      </List.Item>
    )}
  </List>

export const convertAdministrativeDetailsToView = (language, ldsApi, value) =>
  <List relaxed>
    {value.map((element, index) =>
      <List.Item key={index}>
        <List.Content>
          <List.Header style={{ lineHeight: '1.4285em', fontStyle: 'italic' }}>
            {element[GSIM_DEFINITIONS.ADMINISTRATIVE_DETAILS.PROPERTIES.ADMINISTRATIVE_DETAIL_TYPE]}
          </List.Header>
          <List.Description>
            <List.List>
              {element[GSIM_DEFINITIONS.ADMINISTRATIVE_DETAILS.PROPERTIES.VALUES].map(innerElement =>
                <List.Item key={innerElement}>
                  {handleStringForView(innerElement, false, false, false, language, ldsApi)}
                </List.Item>
              )}
            </List.List>
          </List.Description>
        </List.Content>
      </List.Item>
    )}
  </List>

const handleArrayForView = (data, refProperty, refName, language, ldsApi) => {
  if (refProperty !== false) {
    if (refName !== false) {
      switch (refName) {
        case GSIM_DEFINITIONS.MULTILINGUAL_TEXT.NAME:
          return convertMultilingualToView(data)

        case GSIM_DEFINITIONS.ADMINISTRATIVE_DETAILS.NAME:
          return convertAdministrativeDetailsToView(language, ldsApi, data)

        case GSIM_DEFINITIONS.AGENT_DETAILS.NAME:
          return convertAgentDetailsToView(language, ldsApi, data)

        default:
          return NOT_FINISHED
      }
    } else {
      return data.toString()
    }
  }

  return (
    <List>
      {data.map((element, index) =>
        <List.Item key={index}>
          {handleStringForView(element, false, false, false, language, ldsApi)}
        </List.Item>
      )}
    </List>
  )
}

export const handleBooleanForView = value =>
  <Icon
    fitted
    size='large'
    name={value ? 'check' : 'close'}
    style={{ color: value ? SSB_COLORS.GREEN : SSB_COLORS.RED }}
  />

export const convertDataToView = (language, ldsApi, data, schema) => {
  const properties = getNestedObject(schema, GSIM.PROPERTIES(schema))

  return Object.entries(properties).reduce((accumulator, [property]) => {
    if (!property.startsWith(GSIM.LINK_TYPE)) {
      let newProperty = {
        name: property,
        description: properties[property][GSIM.PROPERTY_DESCRIPTION],
        value: null,
        newValue: null
      }

      if (data.hasOwnProperty(property)) {
        let type = null
        let format = false
        let refName = false
        let refProperty = false

        if (properties[property].hasOwnProperty(GSIM.ITEMS)) {
          if (properties[property][GSIM.ITEMS].hasOwnProperty(GSIM.SCHEMA.REF)) {
            const ref = properties[property][GSIM.ITEMS][GSIM.SCHEMA.REF].replace(GSIM.SCHEMA.DEFINITIONS, '')
            refName = ref

            if (schema[GSIM.DEFINITIONS].hasOwnProperty(ref)) {
              refProperty = schema[GSIM.DEFINITIONS][ref]
            }
          }
        }

        if (properties[property].hasOwnProperty(GSIM.SCHEMA.REF)) {
          const ref = properties[property][GSIM.SCHEMA.REF].replace(GSIM.SCHEMA.DEFINITIONS, '')
          refName = ref

          if (schema[GSIM.DEFINITIONS].hasOwnProperty(ref)) {
            if (schema[GSIM.DEFINITIONS][ref].hasOwnProperty(GSIM.TYPE)) {
              type = schema[GSIM.DEFINITIONS][ref][GSIM.TYPE]
              refProperty = schema[GSIM.DEFINITIONS][ref]
            }
          }
        }

        if (properties[property].hasOwnProperty(GSIM_PROPERTY_TYPES.TYPES.ANY_OF)) {
          const something = properties[property][GSIM_PROPERTY_TYPES.TYPES.ANY_OF].filter(element => element[GSIM.TYPE] !== 'null')[0]

          if (something.hasOwnProperty(GSIM.TYPE)) {
            type = something[GSIM.TYPE]
          }

          if (something.hasOwnProperty(GSIM.FORMAT)) {
            format = something[GSIM.FORMAT]
          }

          if (something.hasOwnProperty(GSIM.ITEMS)) {
            if (something[GSIM.ITEMS].hasOwnProperty(GSIM.SCHEMA.REF)) {
              const ref = something[GSIM.ITEMS][GSIM.SCHEMA.REF].replace(GSIM.SCHEMA.DEFINITIONS, '')
              refName = ref

              if (schema[GSIM.DEFINITIONS].hasOwnProperty(ref)) {
                if (schema[GSIM.DEFINITIONS][ref].hasOwnProperty(GSIM.TYPE)) {
                  refProperty = schema[GSIM.DEFINITIONS][ref]
                }
              }
            }
          }

          if (something.hasOwnProperty(GSIM.SCHEMA.REF)) {
            const ref = something[GSIM.SCHEMA.REF].replace(GSIM.SCHEMA.DEFINITIONS, '')
            refName = ref

            if (schema[GSIM.DEFINITIONS].hasOwnProperty(ref)) {
              if (schema[GSIM.DEFINITIONS][ref].hasOwnProperty(GSIM.TYPE)) {
                type = schema[GSIM.DEFINITIONS][ref][GSIM.TYPE]
                refProperty = schema[GSIM.DEFINITIONS][ref]
              }
            }
          }
        }

        if (properties[property].hasOwnProperty(GSIM.TYPE)) {
          type = properties[property][GSIM.TYPE]
        }

        switch (type) {
          case GSIM_PROPERTY_TYPES.TYPES.ARRAY:
            newProperty.value = handleArrayForView(data[property], refProperty, refName, language, ldsApi)
            break

          case GSIM_PROPERTY_TYPES.TYPES.BOOLEAN:
            newProperty.value = handleBooleanForView(data[property])
            break

          case GSIM_PROPERTY_TYPES.TYPES.NUMBER:
            newProperty.value = handleNumberForView(data[property])
            break

          case GSIM_PROPERTY_TYPES.TYPES.OBJECT:
            newProperty.value = `${data[property].toString()} (${NOT_FINISHED})`
            break

          case GSIM_PROPERTY_TYPES.TYPES.STRING:
            if (format === false) {
              format = properties[property].hasOwnProperty(GSIM.FORMAT) ? properties[property][GSIM.FORMAT] : false
            }

            const enumerated = properties[property].hasOwnProperty(GSIM.ENUM) ? properties[property][GSIM.ENUM] : false
            newProperty.value = handleStringForView(data[property], format, enumerated, refProperty, language, ldsApi)
            break

          default:
            newProperty.value = `${data[property].toString()} (${NOT_FINISHED})`
        }
      }

      accumulator[property] = newProperty
    }

    return accumulator
  }, {})
}

export const mapDataToTable = (language, ldsApi, data, schema) => {
  return data.map(item => {
    const values = convertDataToView(language, ldsApi, item, schema)

    return Object.entries(values).reduce((accumulator, [property, item]) => {
      accumulator[property] = item.value

      return accumulator
    }, {})
  })
}

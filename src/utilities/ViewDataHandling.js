import React from 'react'
import { Icon, List } from 'semantic-ui-react'
import { getNestedObject, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { DomainLinkResolve } from '../components/domain'
import { convertDateToView, setConfiguration } from './'
import { GSIM, GSIM_DEFINITIONS } from '../configurations'
import { GSIM_PROPERTY_TYPES } from '../configurations/API'

const NOT_FINISHED = '...'

const handleNumberForView = value => value

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

const handleStringForView = (data, configuration) => {
  if (configuration.format) {
    if (configuration.format === 'date-time') {
      return convertDateToView(data)
    } else {
      console.log(`Format not handled: ${configuration.format}`)
      return data.toString()
    }
  }

  if (configuration.enumerated) {
    return data.toString()
  }

  if (configuration.refProperty) {
    return data.toString()
  }

  if (data.startsWith('/')) {
    return <DomainLinkResolve link={data} />
  }

  if (data.startsWith('http')) {
    return <a target='_blank' rel='noopener noreferrer' href={data}>{data}</a>
  }

  return data.toString()
}

const convertAgentDetailsToView = (configuration, value) =>
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
                  {handleStringForView(innerElement, configuration)}
                </List.Item>
              )}
            </List.List>
          </List.Description>
        </List.Content>
      </List.Item>
    )}
  </List>

const convertAdministrativeDetailsToView = (configuration, value) =>
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
                  {handleStringForView(innerElement, configuration)}
                </List.Item>
              )}
            </List.List>
          </List.Description>
        </List.Content>
      </List.Item>
    )}
  </List>

const handleArrayForView = (data, configuration) => {
  if (configuration.refProperty !== false) {
    if (configuration.refName !== false) {
      switch (configuration.refName) {
        case GSIM_DEFINITIONS.MULTILINGUAL_TEXT.NAME:
          return convertMultilingualToView(data)

        case GSIM_DEFINITIONS.ADMINISTRATIVE_DETAILS.NAME:
          return convertAdministrativeDetailsToView(configuration, data)

        case GSIM_DEFINITIONS.AGENT_DETAILS.NAME:
          return convertAgentDetailsToView(configuration, data)

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
          {handleStringForView(element, configuration)}
        </List.Item>
      )}
    </List>
  )
}

const handleBooleanForView = value =>
  <Icon
    fitted
    size='large'
    name={value ? 'check' : 'close'}
    style={{ color: value ? SSB_COLORS.GREEN : SSB_COLORS.RED }}
  />

const handleUserForView = user =>
  <>
    <Icon size='large' name='user' style={{ color: SSB_COLORS.PURPLE }} />
    {user}
  </>

const handleDateForView = date =>
  <>
    <Icon size='large' name='calendar alternate outline' style={{ color: SSB_COLORS.PURPLE }} />
    {date}
  </>

const handleIdForView = id =>
  <>
    <Icon size='large' name='barcode' style={{ color: SSB_COLORS.PURPLE }} />
    {id}
  </>

const handleVersionForView = version =>
  <>
    <Icon size='large' name='fork' style={{ color: SSB_COLORS.PURPLE }} />
    {version}
  </>

export const convertAutofilledToView = (item, data) => {
  switch (item) {
    case GSIM.PROPERTIES_GROUPING.AUTOFILLED[0]:
      return handleIdForView(data)

    case GSIM.PROPERTIES_GROUPING.AUTOFILLED[3]:
      return handleVersionForView(data)

    case GSIM.PROPERTIES_GROUPING.AUTOFILLED[1]:
    case GSIM.PROPERTIES_GROUPING.AUTOFILLED[4]:
    case GSIM.PROPERTIES_GROUPING.AUTOFILLED[5]:
    case GSIM.PROPERTIES_GROUPING.AUTOFILLED[7]:
    case GSIM.PROPERTIES_GROUPING.AUTOFILLED[8]:
      return handleDateForView(convertDateToView(data))

    case GSIM.PROPERTIES_GROUPING.AUTOFILLED[2]:
    case GSIM.PROPERTIES_GROUPING.AUTOFILLED[6]:
      return handleUserForView(data)

    default:
      return data
  }
}

export const convertDataToView = (data, schema) => {
  const properties = getNestedObject(schema, GSIM.PROPERTIES(schema))

  return Object.entries(properties).reduce((accumulator, [property]) => {
    if (!property.startsWith(GSIM.LINK_TYPE)) {
      let newProperty = {
        name: property,
        description: properties[property][GSIM.PROPERTY_DESCRIPTION],
        value: null
      }

      if (data.hasOwnProperty(property)) {
        const baseRef = getNestedObject(properties, [property, GSIM.SCHEMA.REF])
        const itemsRef = getNestedObject(properties, [property, GSIM.ITEMS, GSIM.SCHEMA.REF])
        const configuration = setConfiguration(baseRef, itemsRef, properties[property], schema)

        switch (configuration.type) {
          case GSIM_PROPERTY_TYPES.TYPES.ARRAY:
            newProperty.value = handleArrayForView(data[property], configuration)
            break

          case GSIM_PROPERTY_TYPES.TYPES.BOOLEAN:
            newProperty.value = handleBooleanForView(data[property])
            break

          case GSIM_PROPERTY_TYPES.TYPES.NUMBER:
            newProperty.value = handleNumberForView(data[property])
            break

          case GSIM_PROPERTY_TYPES.TYPES.OBJECT:
            newProperty.value = `${data[property].toString()} (${NOT_FINISHED} (object))`
            break

          case GSIM_PROPERTY_TYPES.TYPES.STRING:
            newProperty.value = handleStringForView(data[property], configuration)
            break

          default:
            newProperty.value = `${data[property].toString()} (${NOT_FINISHED} (default))`
        }
      }

      accumulator[property] = newProperty
    }

    return accumulator
  }, {})
}

export const mapDataToTable = (data, schema) => {
  return data.map(item => {
    const values = convertDataToView(item, schema)

    return Object.entries(values).reduce((accumulator, [property, item]) => {
      accumulator[property] = item.value

      return accumulator
    }, {})
  })
}

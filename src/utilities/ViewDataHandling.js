import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, List } from 'semantic-ui-react'

import { convertDateToView, getDomainRef, getNestedObject, replaceUnkownDomainProperty } from './'
import { GSIM, GSIM_DEFINITIONS, ROUTING, SSB_COLORS } from '../configurations'

const NOT_FINISHED = '...'

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

// TODO: Handle other types of arrays
export const handleArrayForView = (value, property) => {
  if (property.hasOwnProperty(GSIM.ITEMS)) {
    const item = getDomainRef(property[GSIM.ITEMS])

    switch (item) {
      case GSIM_DEFINITIONS.MULTILINGUAL_TEXT.NAME:
        return convertMultilingualToView(value)

      default:
        return NOT_FINISHED
    }
  }
}

export const handleBooleanForView = value =>
  <Icon
    fitted
    size='large'
    color={value ? 'green' : 'red'}
    name={value ? 'check square outline' : 'square outline'}
    style={{ color: value ? SSB_COLORS.GREEN : SSB_COLORS.RED }}
  />

// TODO: Maybe handle 'number' and ENUM
export const handleStringForView = (value, property) => {
  if (property.hasOwnProperty(GSIM.FORMAT)) {
    switch (property[GSIM.FORMAT]) {
      case 'date-time':
        return convertDateToView(value)

      default:
        return value
    }
  } else {
    if (value.startsWith('/')) {
      return <Link to={`${ROUTING.DOMAIN_BASE}${value.substr(1)}`}>{value}</Link>
    } else {
      return value
    }
  }
}

// TODO: This needs to handle all types and variations of types
export const convertDataToView = (data, schema) => {
  const properties = getNestedObject(schema, GSIM.PROPERTIES(schema))

  return Object.entries(properties).reduce((accumulator, [property]) => {
    if (!property.startsWith(GSIM.LINK_TYPE)) {
      let newProperty = {
        name: replaceUnkownDomainProperty(properties[property][GSIM.PROPERTY_DISPLAY_NAME], property),
        description: properties[property][GSIM.PROPERTY_DESCRIPTION],
        value: null
      }

      if (data.hasOwnProperty(property)) {
        switch (properties[property][GSIM.TYPE]) {
          case 'array':
            newProperty.value = handleArrayForView(data[property], properties[property])
            break

          case 'boolean':
            newProperty.value = handleBooleanForView(data[property])
            break

          case 'object':
            newProperty.value = NOT_FINISHED
            break

          case 'string':
            newProperty.value = handleStringForView(data[property], properties[property])
            break

          default:
            newProperty.value = NOT_FINISHED
        }
      }

      accumulator[property] = newProperty
    }

    return accumulator
  }, {})
}

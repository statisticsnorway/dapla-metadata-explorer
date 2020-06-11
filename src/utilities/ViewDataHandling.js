import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'

import { getNestedObject, replaceUnkownDomainProperty } from './'
import { GSIM, ROUTING, SSB_COLORS } from '../configurations'

const NOT_FINISHED = '...'

export const handleBooleanForView = value =>
  <Icon
    fitted
    size='large'
    color={value ? 'green' : 'red'}
    name={value ? 'check square outline' : 'square outline'}
    style={{ color: value ? SSB_COLORS.GREEN : SSB_COLORS.RED }}
  />

// TODO: Handle 'date-time', 'number' and possibly ENUM
export const handleStringForView = value => {
  if (value.startsWith('/')) {
    return <Link to={`${ROUTING.DOMAIN_BASE}${value.substr(1)}`}>{value}</Link>
  } else {
    return value
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
          case 'boolean':
            newProperty.value = handleBooleanForView(data[property])
            break

          case 'string':
            newProperty.value = handleStringForView(data[property])
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

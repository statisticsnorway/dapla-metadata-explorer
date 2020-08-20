import React from 'react'
import { Icon, List } from 'semantic-ui-react'
import { getNestedObject, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { DomainLinkResolve } from '../components/domain'
import { convertDateToView, getDomainRef, replaceUnkownDomainProperty } from './'
import { GSIM, GSIM_DEFINITIONS } from '../configurations'

const NOT_FINISHED = '...'

export const handleStringForView = (value, property) => {
  if (property.hasOwnProperty(GSIM.FORMAT)) {
    if (property[GSIM.FORMAT] === 'date-time') {
      return convertDateToView(value)
    } else {
      return value
    }
  } else {
    if (value.startsWith('/')) {
      return <DomainLinkResolve link={value} />
    } else if (value.startsWith('http')) {
      return <a target='_blank' rel='noopener noreferrer' href={value}>{value}</a>
    } else if (property.hasOwnProperty(GSIM.ENUM)) {
      return value
    } else {
      return value
    }
  }
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

export const convertAgentDetailsToView = (value, property) =>
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
                  {handleStringForView(innerElement, property)}
                </List.Item>
              )}
            </List.List>
          </List.Description>
        </List.Content>
      </List.Item>
    )}
  </List>

export const convertAdministrativeDetailsToView = (value, property) =>
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
                  {handleStringForView(innerElement, property)}
                </List.Item>
              )}
            </List.List>
          </List.Description>
        </List.Content>
      </List.Item>
    )}
  </List>

export const handleArrayForView = (value, property) => {
  if (property.hasOwnProperty(GSIM.ITEMS)) {
    if (property[GSIM.ITEMS].hasOwnProperty(GSIM.SCHEMA.REF)) {
      const item = getDomainRef(property[GSIM.ITEMS])

      switch (item) {
        case GSIM_DEFINITIONS.MULTILINGUAL_TEXT.NAME:
          return convertMultilingualToView(value)

        case GSIM_DEFINITIONS.ADMINISTRATIVE_DETAILS.NAME:
          return convertAdministrativeDetailsToView(value, property)

        case GSIM_DEFINITIONS.AGENT_DETAILS.NAME:
          return convertAgentDetailsToView(value, property)

        default:
          return NOT_FINISHED
      }
    } else {
      return (
        <List>
          {value.map((element, index) =>
            <List.Item key={index}>
              {handleStringForView(element, property)}
            </List.Item>
          )}
        </List>
      )
    }
  } else {
    return NOT_FINISHED
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

          case 'number':
            newProperty.value = data[property]
            break

          case 'object':
            newProperty.value = NOT_FINISHED
            break

          case 'string':
            newProperty.value = handleStringForView(data[property], properties[property])
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

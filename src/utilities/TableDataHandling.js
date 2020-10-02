import React from 'react'
import { Icon, List, Popup } from 'semantic-ui-react'
import { getNestedObject, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import {
  convertAdministrativeDetailsToView,
  convertAgentDetailsToView,
  getDomainRef,
  handleBooleanForView,
  handleStringForView
} from './'
import { GSIM, GSIM_DEFINITIONS } from '../configurations'
import { TEST_IDS } from '../enums'

const NOT_FINISHED = '...'

const handleArrayPropertyForTable = (language, ldsApi, property, value) => {
  if (property.hasOwnProperty(GSIM.ITEMS)) {
    if (property[GSIM.ITEMS].hasOwnProperty(GSIM.SCHEMA.REF)) {
      const item = getDomainRef(property[GSIM.ITEMS])

      switch (item) {
        case GSIM_DEFINITIONS.MULTILINGUAL_TEXT.NAME:
          return GSIM_DEFINITIONS.MULTILINGUAL_TEXT.LANGUAGE_TEXT(value, language)

        case GSIM_DEFINITIONS.ADMINISTRATIVE_DETAILS.NAME:
          return (
            <Popup
              basic
              flowing
              hoverable
              trigger={
                <Icon name='talk' size='large' data-testid={TEST_IDS.TABLE_HOVER} style={{ color: SSB_COLORS.GREY }} />
              }
            >
              {convertAdministrativeDetailsToView(language, ldsApi, value, property)}
            </Popup>
          )

        case GSIM_DEFINITIONS.AGENT_DETAILS.NAME:
          return (
            <Popup
              basic
              flowing
              hoverable
              trigger={
                <Icon name='talk' size='large' data-testid={TEST_IDS.TABLE_HOVER} style={{ color: SSB_COLORS.GREY }} />
              }
            >
              {convertAgentDetailsToView(language, ldsApi, value, property)}
            </Popup>
          )

        default:
          return NOT_FINISHED
      }
    } else {
      return (
        <Popup basic flowing hoverable trigger={<Icon name='talk' size='large' style={{ color: SSB_COLORS.GREY }} />}>
          <List>
            {value.map((element, index) =>
              <List.Item key={index}>
                {handleStringForView(language, ldsApi, element, property)}
              </List.Item>
            )}
          </List>
        </Popup>
      )
    }
  } else {
    return NOT_FINISHED
  }
}

export const mapDataToTable = (language, ldsApi, data, schema) => {
  const properties = getNestedObject(schema, GSIM.PROPERTIES(schema))

  return data.map(item =>
    Object.entries(item).reduce((accumulator, [property, item]) => {
      switch (properties[property][GSIM.TYPE]) {
        case 'array':
          accumulator[property] = handleArrayPropertyForTable(language, ldsApi, properties[property], item)
          break

        case 'boolean':
          accumulator[property] = handleBooleanForView(item)
          break

        case 'string':
          accumulator[property] = handleStringForView(language, ldsApi, item, properties[property])
          break

        default:
          accumulator[property] = `${item.toString()} (${NOT_FINISHED})`
      }

      return accumulator
    }, {})
  )
}

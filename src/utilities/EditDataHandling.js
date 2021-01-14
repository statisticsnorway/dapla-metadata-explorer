import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { setConfiguration } from './'
import { GSIM, GSIM_DEFINITIONS } from '../configurations'
import { GSIM_PROPERTY_TYPES } from '../configurations/API'

const handleBooleanForEdit = boolean => ({
  inputType: 'boolean',
  value: boolean
})

const handleArrayForEdit = (array, configuration, properties, property, schema) => {
  let inputType = 'array'
  const options = {
    isLink: false,
    links: [],
    values: [],
    multiple: true,
    key: {
      name: null,
      values: [],
      multiple: false
    },
    value: {
      name: null,
      type: 'string',
      multiple: false
    }
  }

  if (properties.hasOwnProperty(`${GSIM.LINK_TYPE}${property}`)) {
    const links = getNestedObject(properties, [`${GSIM.LINK_TYPE}${property}`, GSIM.PROPERTIES_ELEMENT])

    if (links !== undefined) {
      inputType = 'dropdown'
      options.isLink = true
      options.links = Object.keys(links).map(key => key)
    }
  }

  if (configuration.refProperty) {
    if (configuration.refName === GSIM_DEFINITIONS.MULTILINGUAL_TEXT.NAME) {
      const keyRef = configuration.refProperty[GSIM.PROPERTIES_ELEMENT][GSIM_DEFINITIONS.MULTILINGUAL_TEXT.PROPERTIES.LANGUAGE_CODE][GSIM.SCHEMA.REF]
        .replace(GSIM.SCHEMA.DEFINITIONS, '')
      inputType = 'keyValueInput'
      options.key = {
        name: GSIM_DEFINITIONS.MULTILINGUAL_TEXT.PROPERTIES.LANGUAGE_CODE,
        values: schema[GSIM.DEFINITIONS][keyRef][GSIM.ENUM]
      }
      options.value = {
        name: GSIM_DEFINITIONS.MULTILINGUAL_TEXT.PROPERTIES.LANGUAGE_TEXT,
        type: configuration.refProperty[GSIM.PROPERTIES_ELEMENT][GSIM_DEFINITIONS.MULTILINGUAL_TEXT.PROPERTIES.LANGUAGE_TEXT][GSIM.TYPE]
      }
    }

    if (configuration.refName === GSIM_DEFINITIONS.ADMINISTRATIVE_DETAILS.NAME || configuration.refName === GSIM_DEFINITIONS.AGENT_DETAILS.NAME) {
      const ref = {
        AdministrativeDetails: [
          GSIM_DEFINITIONS.ADMINISTRATIVE_DETAILS.PROPERTIES.ADMINISTRATIVE_DETAIL_TYPE,
          GSIM_DEFINITIONS.ADMINISTRATIVE_DETAILS.PROPERTIES.VALUES
        ],
        AgentDetails: [
          GSIM_DEFINITIONS.AGENT_DETAILS.PROPERTIES.AGENT_DETAIL_TYPE,
          GSIM_DEFINITIONS.AGENT_DETAILS.PROPERTIES.VALUES
        ]
      }

      const keyRef = configuration.refProperty[GSIM.PROPERTIES_ELEMENT][ref[configuration.refName][0]][GSIM.SCHEMA.REF].replace(GSIM.SCHEMA.DEFINITIONS, '')
      inputType = 'keyValuesInput'
      options.key = {
        name: ref[configuration.refName][0],
        values: schema[GSIM.DEFINITIONS][keyRef][GSIM.ENUM]
      }
      options.value = {
        multiple: true,
        name: ref[configuration.refName][1],
        type: configuration.refProperty[GSIM.PROPERTIES_ELEMENT][ref[configuration.refName][1]][GSIM.ITEMS][GSIM.TYPE]
      }
    }

    if (configuration.refProperty.hasOwnProperty(GSIM.ITEMS)) {
      console.log(configuration)
    }
  }

  if (configuration.format === 'date-time') {
    inputType = 'date'
    options.multiple = true
  }

  return ({
    inputType: inputType,
    value: array,
    options: options
  })
}

const handleStringForEdit = (string, configuration, properties, property) => {
  let inputType = 'string'
  const options = {
    isLink: false,
    links: [],
    values: [],
    multiple: false
  }

  if (properties.hasOwnProperty(`${GSIM.LINK_TYPE}${property}`)) {
    const links = getNestedObject(properties, [`${GSIM.LINK_TYPE}${property}`, GSIM.PROPERTIES_ELEMENT])

    if (links !== undefined) {
      inputType = 'dropdown'
      options.isLink = true
      options.links = Object.keys(links).map(key => key)
    }
  }

  if (configuration.format) {
    if (configuration.format === 'date-time') {
      inputType = 'date'
    }
  }

  if (configuration.refProperty) {
    if (configuration.refProperty.hasOwnProperty(GSIM.ENUM)) {
      inputType = 'dropdown'
      options.values = configuration.refProperty[GSIM.ENUM].map(element => ({
        key: element,
        text: element,
        value: element
      }))
    }
  }

  return ({
    inputType: inputType,
    value: string,
    options: options
  })
}

const handleObjectForEdit = () => ({
  inputType: undefined,
  value: null
})

const handleNumberForEdit = number => ({
  inputType: 'number',
  value: number
})

const handleUnkownForEdit = () => ({
  inputType: undefined,
  value: null
})

export const convertSchemaToEdit = (data, schema, partOfMultiple = false) => {
  const properties = getNestedObject(schema, GSIM.PROPERTIES(schema))
  const required = getNestedObject(schema, GSIM.REQUIRED(schema))

  return Object.entries(properties).reduce((accumulator, [property]) => {
    if (!property.startsWith(GSIM.LINK_TYPE)) {
      const newProperty = {
        name: property,
        description: properties[property][GSIM.PROPERTY_DESCRIPTION],
        configuration: null,
        required: required.includes(property),
        partOfMultiple: partOfMultiple
      }

      const baseRef = getNestedObject(properties, [property, GSIM.SCHEMA.REF])
      const itemsRef = getNestedObject(properties, [property, GSIM.ITEMS, GSIM.SCHEMA.REF])
      const configuration = setConfiguration(baseRef, itemsRef, properties[property], schema)

      switch (configuration.type) {
        case GSIM_PROPERTY_TYPES.TYPES.ARRAY:
          newProperty.configuration = handleArrayForEdit(
            data.hasOwnProperty(property) ? data[property] : null, configuration, properties, property, schema
          )
          break

        case GSIM_PROPERTY_TYPES.TYPES.BOOLEAN:
          newProperty.configuration = handleBooleanForEdit(data.hasOwnProperty(property) ? data[property] : false)
          break

        case GSIM_PROPERTY_TYPES.TYPES.NUMBER:
          newProperty.configuration = handleNumberForEdit(data.hasOwnProperty(property) ? data[property] : null)
          break

        case GSIM_PROPERTY_TYPES.TYPES.OBJECT:
          newProperty.configuration = handleObjectForEdit()
          break

        case GSIM_PROPERTY_TYPES.TYPES.STRING:
          newProperty.configuration = handleStringForEdit(data.hasOwnProperty(property) ? data[property] : null, configuration, properties, property)
          break

        default:
          newProperty.configuration = handleUnkownForEdit()
      }

      accumulator[property] = newProperty
    }

    return accumulator
  }, {})
}

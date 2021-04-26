import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { getDomainRef } from './'
import { GSIM, GSIM_PROPERTY_TYPES } from '../configurations'
import { UI } from '../enums'

export const createEmptyDataObject = (id, user) => {
  const data = {}
  const dateNow = new Date(Date.now()).toISOString()
  const autofilledDates = GSIM.PROPERTIES_GROUPING.AUTOFILLED.filter((value, index) => [1, 4, 5].includes(index))
  const defaultFilledDates = GSIM.PROPERTIES_GROUPING.COMMON.filter((value, index) => [6].includes(index))

  data[GSIM.PROPERTIES_GROUPING.AUTOFILLED[0]] = id
  data[GSIM.PROPERTIES_GROUPING.AUTOFILLED[2]] = user
  data[GSIM.PROPERTIES_GROUPING.AUTOFILLED[3]] = '1.0.0'
  data[GSIM.PROPERTIES_GROUPING.AUTOFILLED[6]] = user
  autofilledDates.forEach(property => data[property] = dateNow)
  defaultFilledDates.forEach(property => data[property] = dateNow)

  return data
}

export const updateDataObject = (data, user) => {
  const clone = Object.assign({}, data)
  const dateNow = new Date(Date.now()).toISOString()
  const version = clone[GSIM.PROPERTIES_GROUPING.AUTOFILLED[3]].split('.')

  version[2] = (parseInt(version[2]) + 1).toString()

  clone[GSIM.PROPERTIES_GROUPING.AUTOFILLED[3]] = version.join('.')
  clone[GSIM.PROPERTIES_GROUPING.AUTOFILLED[4]] = dateNow
  clone[GSIM.PROPERTIES_GROUPING.AUTOFILLED[5]] = dateNow
  clone[GSIM.PROPERTIES_GROUPING.AUTOFILLED[6]] = user

  return clone
}

const sortGroups = schemas => {
  const groups = {}
  let flatGroups = []

  for (const group in GSIM.GROUPS) {
    if (GSIM.GROUPS.hasOwnProperty(group)) {
      groups[group.toLowerCase()] = schemas.filter(schema => GSIM.GROUPS[group].DOMAINS.includes(getDomainRef(schema)))
      flatGroups = flatGroups.concat(GSIM.GROUPS[group].DOMAINS)
    }
  }

  groups.undefined = schemas.filter(schema => {
    const domainRef = getDomainRef(schema)

    return !flatGroups.includes(domainRef) && domainRef !== GSIM.ABOUT.NAME
  })

  return groups
}

export const sortSchemas = schemas => {
  const about = schemas.find(schema => getDomainRef(schema) === GSIM.ABOUT.NAME)
  const version = getNestedObject(about, GSIM.ABOUT.VERSION)
  const changelog = getNestedObject(about, GSIM.ABOUT.CHANGELOG)

  return ({
    version: version !== undefined ? version : UI.UNKOWN,
    changelog: changelog !== undefined ? changelog : UI.UNKOWN,
    groups: sortGroups(schemas)
  })
}

export const setConfiguration = (baseRef, itemsRef, property, schema) => {
  const configuration = {
    type: null,
    format: false,
    enumerated: false,
    refName: false,
    refProperty: false,
    isLink: false
  }

  if (baseRef !== undefined) {
    configuration.refName = baseRef.replace(GSIM.SCHEMA.DEFINITIONS, '')
    configuration.refProperty = getNestedObject(schema, [GSIM.DEFINITIONS, configuration.refName])

    if (configuration.refProperty.hasOwnProperty(GSIM.TYPE)) {
      configuration.type = configuration.refProperty[GSIM.TYPE]
    }
  }

  if (itemsRef !== undefined) {
    configuration.refName = itemsRef.replace(GSIM.SCHEMA.DEFINITIONS, '')
    configuration.refProperty = getNestedObject(schema, [GSIM.DEFINITIONS, configuration.refName])
  }

  if (property.hasOwnProperty(GSIM_PROPERTY_TYPES.TYPES.ANY_OF)) {
    const anyOf = property[GSIM_PROPERTY_TYPES.TYPES.ANY_OF].filter(element => element[GSIM.TYPE] !== 'null')[0]

    if (anyOf.hasOwnProperty(GSIM.TYPE)) {
      configuration.type = anyOf[GSIM.TYPE]
    }

    if (anyOf.hasOwnProperty(GSIM.FORMAT)) {
      configuration.format = anyOf[GSIM.FORMAT]
    }

    const anyOfTypeItemsRef = getNestedObject(anyOf, [GSIM.ITEMS, GSIM.SCHEMA.REF])

    if (anyOfTypeItemsRef !== undefined) {
      configuration.refName = anyOfTypeItemsRef.replace(GSIM.SCHEMA.DEFINITIONS, '')
      const anyOfItemsRefProperty = getNestedObject(schema, [GSIM.DEFINITIONS, configuration.refName])

      if (anyOfItemsRefProperty.hasOwnProperty(GSIM.TYPE)) {
        configuration.refProperty = anyOfItemsRefProperty
      }
    }

    if (anyOf.hasOwnProperty(GSIM.SCHEMA.REF)) {
      const anyOfTypeRef = getNestedObject(anyOf, [GSIM.SCHEMA.REF]).replace(GSIM.SCHEMA.DEFINITIONS, '')
      const anyOfTypeRefProperty = getNestedObject(schema, [GSIM.DEFINITIONS, anyOfTypeRef])

      if (anyOfTypeRefProperty.hasOwnProperty(GSIM.TYPE)) {
        configuration.type = anyOfTypeRefProperty[GSIM.TYPE]
        configuration.refProperty = anyOfTypeRefProperty
      }
    }
  }

  if (property.hasOwnProperty(GSIM.TYPE)) {
    configuration.type = property[GSIM.TYPE]

    if (property.hasOwnProperty(GSIM.ITEMS)) {
      configuration.format = property[GSIM.ITEMS][GSIM.FORMAT]
    }
  }

  if (property.hasOwnProperty(GSIM.FORMAT)) {
    configuration.format = property[GSIM.FORMAT]
  }

  if (property.hasOwnProperty(GSIM.ENUM)) {
    configuration.enumerated = property[GSIM.ENUM]
  }

  return configuration
}

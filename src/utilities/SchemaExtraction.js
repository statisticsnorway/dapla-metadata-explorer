import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { GSIM } from '../configurations'
import { UI } from '../enums'

const checkUnkown = string => string !== undefined ? string : UI.UNKOWN

const replaceUnknownDomain = (name, schema) => name === undefined || name === '' ? getDomainRef(schema) : name

export const replaceUnkownDomainProperty = (name, property) => name === undefined || name === '' ? property : name

export const getDomainRef = schema => getNestedObject(schema, [GSIM.SCHEMA.REF]).replace(GSIM.SCHEMA.DEFINITIONS, '')

export const getDomainDescription = schema => {
  const description = getNestedObject(schema, GSIM.DESCRIPTION(schema))

  return checkUnkown(description)
}
export const getDomainDisplayName = schema =>
  replaceUnknownDomain(getNestedObject(schema, GSIM.DISPLAY_NAME(schema)), schema)

export const getDomainPropertyDisplayName = (schema, domain, property) =>
  replaceUnkownDomainProperty(getNestedObject(schema, GSIM.PROPERTIES_DISPLAY_NAME(domain, property)), property)

export const getDomainSchema = (domain, schemas) => Object.entries(schemas.groups).reduce((accumulator, group) => {
  const getSchema = group[1].reduce((accumulator, schema) => {
    if (getDomainRef(schema) === domain) {
      accumulator = schema
    }

    return accumulator
  }, {})

  if (Object.entries(getSchema).length !== 0 && getSchema.constructor === Object) {
    accumulator = getSchema
  }

  return accumulator
}, {})

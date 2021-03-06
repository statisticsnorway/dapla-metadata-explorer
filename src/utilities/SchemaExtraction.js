import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { GSIM } from '../configurations'
import { UI } from '../enums'

const checkUnkown = string => string !== undefined ? string : UI.UNKOWN

export const getDomainRef = schema => getNestedObject(schema, [GSIM.SCHEMA.REF]).replace(GSIM.SCHEMA.DEFINITIONS, '')

export const replaceUnkownDomainProperty = (name, property) => name === undefined || name === '' ? property : name

export const getDomainDescription = schema => {
  const description = getNestedObject(schema, GSIM.DESCRIPTION(schema))

  return checkUnkown(description)
}

export const getDomainSchema = (domain, schemas) => Object.entries(schemas.groups).reduce((accumulator, group) => {
  const getSchema = group[1].reduce((groupAccumulator, schema) => {
    if (getDomainRef(schema) === domain) {
      groupAccumulator = schema
    }

    return groupAccumulator
  }, {})

  if (Object.entries(getSchema).length !== 0 && getSchema.constructor === Object) {
    accumulator = getSchema
  }

  return accumulator
}, {})

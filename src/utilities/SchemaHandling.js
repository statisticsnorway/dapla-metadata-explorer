import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { GSIM } from '../configurations'
import { UI } from '../enums'

const checkUnkown = string => string !== undefined ? string : UI.UNKOWN

const replaceUnknownDomain = (name, schema) => name === undefined || name === '' ? getDomainRef(schema) : name

export const replaceUnkownDomainProperty = (name, property) => name === undefined || name === '' ? property : name

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

export const getDomainDescription = schema => {
  const description = getNestedObject(schema, GSIM.DESCRIPTION(schema))

  return checkUnkown(description)
}
export const getDomainDisplayName = schema =>
  replaceUnknownDomain(getNestedObject(schema, GSIM.DISPLAY_NAME(schema)), schema)

export const getDomainPropertyDisplayName = (schema, domain, property) =>
  replaceUnkownDomainProperty(getNestedObject(schema, GSIM.PROPERTIES_DISPLAY_NAME(domain, property)), property)

export const getDomainRef = schema => getNestedObject(schema, [GSIM.SCHEMA.REF]).replace(GSIM.SCHEMA.DEFINITIONS, '')

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

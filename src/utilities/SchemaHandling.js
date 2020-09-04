import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { getDomainRef } from './'
import { GSIM } from '../configurations'
import { UI } from '../enums'

export const createEmptyDataObject = (schema, id) => {
  const data = {}
  const properties = getNestedObject(schema, GSIM.PROPERTIES(schema))

  Object.keys(properties).forEach(property => {
    if (!property.startsWith(GSIM.LINK_TYPE)) {
      if (properties[property].hasOwnProperty(GSIM.TYPE)) {
        switch (properties[property][GSIM.TYPE]) {
          case 'array':
            data[property] = ['']
            break

          case 'boolean':
            data[property] = null
            break

          default:
            data[property] = ''
        }
      } else {
        data[property] = ''
      }
    }
  })

  data.id = id

  return data
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

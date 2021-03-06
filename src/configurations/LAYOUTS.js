import React from 'react'
import { Link } from 'react-router-dom'

import { camelToTitle } from '../utilities'
import { GSIM, ROUTING } from './'
import { DOMAIN } from '../enums'

export const DOMAIN_PROPERTY_GROUPING = [
  {
    id: 'COMMON',
    getName: (language) => DOMAIN.COMMON_NAME[language],
    description: (language) => DOMAIN.COMMON_PROPERTIES[language],
    test: (property) => GSIM.PROPERTIES_GROUPING.COMMON.includes(property)
  },
  {
    id: 'UNIQUE',
    getName: (language) => DOMAIN.UNIQUE_NAME[language],
    description: (language) => DOMAIN.UNIQUE_PROPERTIES[language],
    test: (property) => !GSIM.PROPERTIES_GROUPING.COMMON
      .concat(GSIM.PROPERTIES_GROUPING.AUTOFILLED)
      .includes(property) && !property.startsWith(GSIM.LINK_TYPE)
  },
  {
    id: 'AUTOFILLED',
    getName: (language) => DOMAIN.AUTOFILLED_NAME[language],
    description: (language) => DOMAIN.AUTOFILLED_PROPERTIES[language],
    test: (property) => GSIM.PROPERTIES_GROUPING.AUTOFILLED.includes(property)
  }
]

export const DOMAIN_PROPERTIES_SORT = (id, a, b) => {
  if (id !== 'UNIQUE') {
    const aIndex = GSIM.PROPERTIES_GROUPING[id].indexOf(a)
    const bIndex = GSIM.PROPERTIES_GROUPING[id].indexOf(b)

    if (aIndex < bIndex) {
      return -1
    }

    if (aIndex > bIndex) {
      return 1
    }

    return 0
  } else {
    return 0
  }
}

export const SEARCH_LAYOUT = {
  categoryLayoutRenderer: ({ categoryContent, resultsContent }) => {
    let color = '#999'

    if (GSIM.GROUPS.hasOwnProperty(categoryContent.toUpperCase())) {
      color = GSIM.GROUPS[categoryContent.toUpperCase()].COLOR
    }

    return (
      <>
        <div className='name' style={{ background: color }}>{categoryContent}</div>
        <div className='results'>
          {resultsContent}
        </div>
      </>
    )
  },
  categoryRenderer: ({ name }) => name,
  resultRenderer: ({ domain, title, description }) => (
    <Link to={`${ROUTING.DOMAIN_BASE}${domain}`}>
      <div className='content'>
        <div className='title'>{camelToTitle(title)}</div>
        <div className='description'>{description}</div>
      </div>
    </Link>
  )
}

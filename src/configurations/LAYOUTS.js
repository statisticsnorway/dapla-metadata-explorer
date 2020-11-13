import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Input } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { camelToTitle, getDomainRef } from '../utilities'
import { GSIM, ROUTING } from './'
import { DOMAIN, UI } from '../enums'

export const DOMAIN_PROPERTY_GROUPING = [
  {
    name: 'COMMON',
    description: (language) => DOMAIN.COMMON_PROPERTIES[language],
    test: (property) => GSIM.PROPERTIES_GROUPING.COMMON.includes(property)
  },
  {
    name: 'UNIQUE',
    description: (language) => DOMAIN.UNIQUE_PROPERTIES[language],
    test: (property) => !GSIM.PROPERTIES_GROUPING.COMMON
      .concat(GSIM.PROPERTIES_GROUPING.AUTOFILLED)
      .includes(property) && !property.startsWith(GSIM.LINK_TYPE)
  },
  {
    name: 'AUTOFILLED',
    description: (language) => DOMAIN.AUTOFILLED_PROPERTIES[language],
    test: (property) => GSIM.PROPERTIES_GROUPING.AUTOFILLED.includes(property)
  }
]

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

const TABLE_CELLS = (header, { value }, truncationLength) => value

export const TABLE_HEADERS = (headers, schema, truncationLength, language) => headers.map(header => {
  const domain = getDomainRef(schema)

  if (header !== 'id') {
    return ({
      accessor: header,
      Cell: props => TABLE_CELLS(header, props, truncationLength),
      Header: camelToTitle(header),
      headerStyle: { fontWeight: '700' },
      Filter: ({ filter, onChange }) => (
        <Input
          fluid
          placeholder={UI.SEARCH[language]}
          value={filter ? filter.value : ''}
          onChange={(event, { value }) => onChange(value)}
        />
      )
    })
  } else {
    return ({
      width: 27,
      sortable: false,
      accessor: header,
      filterable: false,
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      },
      Cell: props =>
        <Link to={`${ROUTING.DOMAIN_BASE}${domain}/${props.value}`}>
          <Icon fitted name='file alternate outline' size='large' style={{ color: SSB_COLORS.BLUE }} />
        </Link>
    })
  }
})

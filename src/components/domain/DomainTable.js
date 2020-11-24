import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'

import { camelToTitle } from '../../utilities'
import { GSIM, ROUTING } from '../../configurations'

function DomainTable ({ data, domain, tableHeaders }) {
  const filteredTableHeaders = tableHeaders.filter(header => header !== GSIM.ID)

  const sorter = (a, b) => {
    if (filteredTableHeaders.indexOf(a[0]) < filteredTableHeaders.indexOf(b[0])) {
      return -1
    } else {
      return 1
    }
  }

  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          {filteredTableHeaders.map(header =>
            <Table.HeaderCell key={header}>{camelToTitle(header)}</Table.HeaderCell>
          )}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map(row =>
          <Table.Row key={row[GSIM.ID]}>
            {Object.entries(row).filter(([key]) => filteredTableHeaders.includes(key)).sort(sorter)
              .map(([key, value]) =>
                <Table.Cell key={key}>
                  {key === GSIM.NAME || key === GSIM.PROPERTY_DESCRIPTION ?
                    <Link to={`${ROUTING.DOMAIN_BASE}${domain}/${row.id}`} style={{ color: 'inherit' }}>
                      {value}
                    </Link>
                    : value
                  }
                </Table.Cell>
              )
            }
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}

export default DomainTable

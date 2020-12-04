import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Header, Table } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'
import { camelToTitle } from '../../utilities'
import { GSIM, ROUTING } from '../../configurations'
import { UI } from '../../enums'

function DomainTable ({ data, domain, tableHeaders }) {
  const { language } = useContext(LanguageContext)

  const filteredTableHeaders = tableHeaders.filter(header => header !== GSIM.ID)

  const sorter = (a, b) => {
    if (filteredTableHeaders.indexOf(a[0]) < filteredTableHeaders.indexOf(b[0])) {
      return -1
    } else {
      return 1
    }
  }

  return (
    <>
      {data.length === 0 && <Header textAlign='center' content={UI.NOTHING_FOUND[language]} />}
      {data.length !== 0 &&
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            {filteredTableHeaders.map(header =>
              <Table.HeaderCell key={header}>{camelToTitle(header)}</Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.length !== 0 && data.map(row =>
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
      }
    </>
  )
}

export default DomainTable

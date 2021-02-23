import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Header, Icon, Table } from 'semantic-ui-react'

import DomainJsonData from './DomainJsonData'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import { camelToTitle, convertDateToView } from '../../utilities'
import { GSIM, ROUTING } from '../../configurations'
import { UI } from '../../enums'

function DomainTable ({
  data,
  rawData,
  domain,
  tableHeaders,
  formConfiguration,
  sortColumn,
  sortDirection,
  sortTable,
  dispatchSorting
}) {
  const { apiReadOnly } = useContext(ApiContext)
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
      <>
        <Table celled selectable sortable>
          <Table.Header>
            <Table.Row>
              {filteredTableHeaders.map(header =>
                <Table.HeaderCell
                  key={header}
                  style={{
                    cursor:
                      (GSIM.PROPERTIES_GROUPING.AUTOFILLED.includes(header) || header === 'shortName') ?
                        'pointer' : 'default'
                  }}
                  sorted={sortColumn === header ? sortDirection : null}
                  onClick={() => dispatchSorting({ sortColumn: header })}
                >
                  {camelToTitle(header)}
                  {sortColumn === header ? null :
                    (GSIM.PROPERTIES_GROUPING.AUTOFILLED.includes(header) || header === 'shortName') ?
                      <Icon name='sort' /> : null
                  }
                </Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.length !== 0 && data.sort((a, b) => sortTable(a, b)).map(row =>
              <Table.Row key={row[GSIM.ID]}>
                {Object.entries(row).filter(([key]) => filteredTableHeaders.includes(key)).sort(sorter)
                  .map(([key, value]) =>
                    <Table.Cell key={key}>
                      {
                        key === GSIM.NAME || key === GSIM.PROPERTY_DESCRIPTION ?
                          <Link to={`${ROUTING.DOMAIN_BASE}${domain}/${row.id}`} style={{ color: 'inherit' }}>
                            {value}
                          </Link>
                          : formConfiguration[key].configuration.inputType === 'date' ?
                            convertDateToView(value) : value
                      }
                    </Table.Cell>
                  )
                }
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        {!apiReadOnly && <DomainJsonData domain={domain} rawData={rawData} />}
      </>
      }
    </>
  )
}

export default DomainTable

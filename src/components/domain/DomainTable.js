import React, { useContext } from 'react'
import ReactTable from 'react-table-6'

import { LanguageContext } from '../../utilities'
import { DOMAIN_TABLE } from '../../enums'

const filterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id

  return row[id] !== undefined && typeof row[id] === 'string' ?
    String(row[id].toLowerCase()).includes(filter.value.toLowerCase()) : true
}

function DomainTable ({ columns, data, loading }) {
  const { language } = useContext(LanguageContext)

  return (
    <ReactTable
      sortable
      filterable
      data={data}
      resizable={false}
      columns={columns}
      loading={loading}
      defaultPageSize={20}
      className='-highlight'
      defaultFilterMethod={filterMethod}
      ofText={DOMAIN_TABLE.OF[language]}
      nextText={DOMAIN_TABLE.NEXT[language]}
      pageText={DOMAIN_TABLE.PAGE[language]}
      rowsText={DOMAIN_TABLE.ROWS[language]}
      loadingText={DOMAIN_TABLE.LOADING[language]}
      previousText={DOMAIN_TABLE.PREVIOUS[language]}
      noDataText={DOMAIN_TABLE.NOTHING_FOUND[language]}
    />
  )
}

export default DomainTable

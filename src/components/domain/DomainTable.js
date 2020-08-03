import React, { useContext } from 'react'
import ReactTable from 'react-table-6'
import { REACT_TABLE_TEXT, reactTableCustomFilterMethod } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../utilities'

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
      defaultFilterMethod={reactTableCustomFilterMethod}
      ofText={REACT_TABLE_TEXT.OF[language]}
      nextText={REACT_TABLE_TEXT.NEXT[language]}
      pageText={REACT_TABLE_TEXT.PAGE[language]}
      rowsText={REACT_TABLE_TEXT.ROWS[language]}
      loadingText={REACT_TABLE_TEXT.LOADING[language]}
      previousText={REACT_TABLE_TEXT.PREVIOUS[language]}
      noDataText={REACT_TABLE_TEXT.NOTHING_FOUND[language]}
    />
  )
}

export default DomainTable

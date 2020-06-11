import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { useParams } from 'react-router-dom'
import { Divider, Grid, Header, Icon, Loader } from 'semantic-ui-react'

import { ErrorMessage } from '../'
import { DomainTable, DomainTableHeaders } from './'
import {
  ApiContext,
  getDomainDescription,
  getDomainDisplayName,
  getDomainSchema,
  LanguageContext,
  mapDataToTable,
  SchemasContext
} from '../../utilities'
import { API, GSIM, infoPopup, SSB_COLORS, TABLE_HEADERS } from '../../configurations'
import { DOMAIN } from '../../enums'

function Domain () {
  const { domain } = useParams()
  const { restApi } = useContext(ApiContext)
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)

  const [tableData, setTableData] = useState([])
  const [tableColumns, setTableColumns] = useState([])
  const [schema, setSchema] = useState(getDomainSchema(domain, schemas))
  const [tableHeaders, setTableHeaders] = useState(GSIM.DEFAULT_TABLE_HEADERS)
  const [truncationLength, setTruncationLength] = useState(200 / tableHeaders.length)

  const [{ data, loading, error }, refetch] = useAxios(`${restApi}${API.GET_DOMAIN_DATA(domain)}`)

  useEffect(() => {
    try {
      setTableHeaders(GSIM.DEFAULT_TABLE_HEADERS)
      setSchema(getDomainSchema(domain, schemas))
    } catch (e) {
      console.log(e)
    }
  }, [domain, schemas])

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      try {
        setTableData(mapDataToTable(data, schema, language))
      } catch (e) {
        console.log(e)
      }
    }
  }, [data, error, language, loading, schema])

  useEffect(() => {
    try {
      setTableColumns(TABLE_HEADERS(tableHeaders, schema, truncationLength, language))
    } catch (e) {
      console.log(e)
    }
  }, [language, schema, tableHeaders, truncationLength])

  return (
    <>
      <Grid columns='equal'>
        <Grid.Column>
          <Header size='large' content={getDomainDisplayName(schema)} subheader={getDomainDescription(schema)} />
        </Grid.Column>
        <Grid.Column textAlign='right' verticalAlign='middle'>
          {infoPopup(
            DOMAIN.REFRESH_DOMAIN_LIST[language],
            <Icon
              link
              name='sync'
              size='large'
              onClick={refetch}
              loading={loading}
              disabled={loading}
              style={{ color: SSB_COLORS.BLUE }}
            />,
            'left center'
          )}
          {loading ? '-' : `(${tableData.length})`}
        </Grid.Column>
      </Grid>
      <Divider hidden />
      <DomainTableHeaders
        schema={schema}
        headers={tableHeaders}
        setHeaders={setTableHeaders}
        setTrunc={setTruncationLength}
      />
      {loading ? <Loader active inline='centered' /> :
        error ? <ErrorMessage error={error} /> : <DomainTable data={tableData} columns={tableColumns} />
      }
    </>
  )
}

export default Domain

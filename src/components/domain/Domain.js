import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Link, useParams } from 'react-router-dom'
import { Button, Divider, Grid, Header, Icon, Input, Loader } from 'semantic-ui-react'
import {
  ErrorMessage,
  getLocalizedGsimObjectText,
  InfoPopup,
  LANGUAGE,
  SSB_COLORS
} from '@statisticsnorway/dapla-js-utilities'

import { DomainTable, DomainTableHeaders } from './'
import { ApiContext, LanguageContext, SchemasContext } from '../../context/AppContext'
import {
  camelToTitle,
  convertSchemaToEdit,
  getDomainDescription,
  getDomainSchema,
  mapDataToTable
} from '../../utilities'
import { API, GSIM, ROUTING, STORAGE } from '../../configurations'
import { DOMAIN } from '../../enums'

const headersByLocalStorage = domain => localStorage.hasOwnProperty(STORAGE.DOMAIN_TABLE_HEADERS(domain)) ?
  localStorage.getItem(STORAGE.DOMAIN_TABLE_HEADERS(domain)).split(',') : GSIM.DEFAULT_TABLE_HEADERS
const checkIncludes = (name, value) =>
  getLocalizedGsimObjectText(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode, name).toUpperCase()
    .includes(value.toUpperCase())
  ||
  getLocalizedGsimObjectText(LANGUAGE.LANGUAGES.ENGLISH.languageCode, name).toUpperCase()
    .includes(value.toUpperCase())
const checkStartsWith = (name, value) =>
  getLocalizedGsimObjectText(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode, name).toUpperCase()
    .startsWith(value.toUpperCase())
  ||
  getLocalizedGsimObjectText(LANGUAGE.LANGUAGES.ENGLISH.languageCode, name).toUpperCase()
    .startsWith(value.toUpperCase())

function Domain () {
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)
  const { ldsApi, apiReadOnly, showUnnamed } = useContext(ApiContext)

  const { domain } = useParams()

  const [tableData, setTableData] = useState([])
  const [tableFilterValue, setTableFilterValue] = useState('')
  const [schema, setSchema] = useState(getDomainSchema(domain, schemas))
  const [formConfiguration, setFormConfiguration] = useState(convertSchemaToEdit({}, schema))

  const [tableHeaders, setTableHeaders] = useState(headersByLocalStorage(domain))

  const [{ data, loading, error }, refetch] = useAxios(`${ldsApi}${API.GET_DOMAIN_DATA(domain)}`, { useCache: false })

  useEffect(() => {
    try {
      const newSchema = getDomainSchema(domain, schemas)

      setTableHeaders(headersByLocalStorage(domain))
      setSchema(newSchema)
      setTableFilterValue('')
      setFormConfiguration(convertSchemaToEdit({}, newSchema))
    } catch (e) {
      console.log(e)
    }
  }, [domain, schemas])

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      try {
        setTableData(mapDataToTable(data, schema, showUnnamed))
        setTableFilterValue('')
      } catch (e) {
        console.log(e)
      }
    }
  }, [data, error, loading, schema, showUnnamed])

  const handleTableFilter = (e, { value }) => {
    if (value.length >= 2) {
      setTableData(mapDataToTable(data.filter(({ name }) => checkIncludes(name, value)), schema))
    } else {
      setTableData(mapDataToTable(data.filter(({ name }) => checkStartsWith(name, value)), schema))
    }

    setTableFilterValue(value)
  }

  return (
    <>
      <Grid columns='equal'>
        <Grid.Column>
          <Header
            size='large'
            content={camelToTitle(domain)}
            subheader={getDomainDescription(schema)}
            icon={{ name: 'list alternate outline', style: { color: SSB_COLORS.BLUE } }}
          />
          <Divider hidden />
          <InfoPopup
            position='right center'
            text={DOMAIN.SEARCH_TABLE_INFO[language]}
            trigger={
              <Input
                size='large'
                icon='search'
                value={tableFilterValue}
                onChange={handleTableFilter}
                placeholder={DOMAIN.SEARCH_TABLE[language]}
              />
            }
          />
        </Grid.Column>
        <Grid.Column textAlign='right'>
          {!apiReadOnly &&
          <>
            <Button
              as={Link}
              size='large'
              disabled={loading || apiReadOnly}
              to={`${ROUTING.DOMAIN_BASE}${domain}/new`}
              style={{ backgroundColor: SSB_COLORS.BLUE }}
            >
              <Icon name='pencil alternate' style={{ paddingRight: '0.5rem' }} />
              {`${DOMAIN.CREATE_NEW[language]} '${camelToTitle(domain)}'`}
            </Button>
            <Divider hidden />
          </>
          }
          <InfoPopup
            position='left center'
            text={DOMAIN.REFRESH_DOMAIN_LIST[language]}
            trigger={
              <Icon
                link
                size='large'
                loading={loading}
                disabled={loading}
                name='sync alternate'
                style={{ color: SSB_COLORS.BLUE }}
                onClick={() => {
                  refetch()
                  setTableFilterValue('')
                }}
              />
            }
          />
          {loading ? '-' : `(${tableData.length})`}
        </Grid.Column>
      </Grid>
      <Divider hidden />
      <DomainTableHeaders
        schema={schema}
        headers={tableHeaders}
        setHeaders={setTableHeaders}
        formConfiguration={formConfiguration}
      />
      {loading ? <Loader active inline='centered' /> :
        error ? <ErrorMessage error={error} language={language} /> :
          <DomainTable data={tableData} domain={domain} tableHeaders={tableHeaders} />
      }
    </>
  )
}

export default Domain

import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { useParams } from 'react-router-dom'
import { Divider, Grid, Header, Loader } from 'semantic-ui-react'
import {
  ErrorMessage,
  getLocalizedGsimObjectText,
  getNestedObject,
  InfoPopup,
  SSB_COLORS
} from '@statisticsnorway/dapla-js-utilities'

import { DomainInstanceEdit } from './'
import { ApiContext, LanguageContext, SchemasContext } from '../../context/AppContext'
import { camelToTitle, convertDataToView, getDomainSchema } from '../../utilities'
import { API, DOMAIN_PROPERTY_GROUPING, GSIM } from '../../configurations'

function DomainInstance () {
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)
  const { ldsApi, apiReadOnly } = useContext(ApiContext)

  const { domain, id } = useParams()

  const [ready, setReady] = useState(false)
  const [schema, setSchema] = useState(getDomainSchema(domain, schemas))
  const [domainInstanceData, setDomainInstanceData] = useState(null)

  const [{ data, loading, error }, refetch] =
    useAxios(`${ldsApi}${API.GET_DOMAIN_INSTANCE_DATA(domain, id)}`, { manual: true, useCache: false })

  const properties = Object.entries(getNestedObject(schema, GSIM.PROPERTIES(schema)))

  useEffect(() => {
    refetch()
    setReady(false)
  }, [id, refetch])

  useEffect(() => {
    try {
      setSchema(getDomainSchema(domain, schemas))
      setReady(false)
    } catch (e) {
      setReady(false)
      console.log(e)
    }
  }, [domain, schemas])

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      try {
        setDomainInstanceData(convertDataToView(data, schema))
        setReady(true)
      } catch (e) {
        setReady(false)
        console.log(e)
      }
    }
  }, [data, error, loading, schema])

  return (
    <>
      <Header
        size='large'
        subheader={camelToTitle(domain)}
        style={{ marginTop: '-.14285714em' }}
        icon={{ name: 'file alternate outline', style: { color: SSB_COLORS.BLUE } }}
        content={ready ? getLocalizedGsimObjectText(language, data[GSIM.NAME]) : id}
      />
      <Divider hidden />
      {loading ? <Loader active inline='centered' /> :
        error ? <ErrorMessage error={error} language={language} /> : ready &&
          <Grid columns='equal' divided>
            <Grid.Row>
              {DOMAIN_PROPERTY_GROUPING.map(({ name, test }) =>
                <Grid.Column key={name}>
                  <Grid divided>
                    {ready && properties.filter(([property]) => test(property)).map(([property]) => {
                        const { description, name, value } = domainInstanceData[property]

                        return (
                          <Grid.Row key={property}>
                            <Grid.Column textAlign='right' verticalAlign='middle' width={5}>
                              <InfoPopup text={description} trigger={<b>{camelToTitle(name)}</b>} />
                            </Grid.Column>
                            <Grid.Column width={11} verticalAlign='middle'>{value}</Grid.Column>
                          </Grid.Row>
                        )
                      }
                    )}
                  </Grid>
                </Grid.Column>
              )}
            </Grid.Row>
          </Grid>
      }
      {ready && !apiReadOnly &&
      <>
        <Divider hidden />
        <DomainInstanceEdit data={data} refetch={refetch} />
      </>
      }
    </>
  )
}

export default DomainInstance

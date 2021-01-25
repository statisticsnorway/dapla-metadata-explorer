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

import { DomainInstanceDelete, DomainInstanceEdit, DomainInstanceGraph } from './'
import { ApiContext, LanguageContext, SchemasContext } from '../../context/AppContext'
import { camelToTitle, convertDataToView, getDomainSchema } from '../../utilities'
import { API, DOMAIN_PROPERTY_GROUPING, GSIM } from '../../configurations'

function DomainInstance () {
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)
  const { ldsApi, apiReadOnly } = useContext(ApiContext)

  const { domain, id } = useParams()

  const [ready, setReady] = useState(false)
  const [wasDeleted, setWasDeleted] = useState(false)
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
      {loading ? <Loader active inline='centered' /> :
        error ? <ErrorMessage error={error} language={language} /> : ready &&
          <>
            <Header
              size='large'
              subheader={camelToTitle(domain)}
              style={{ marginTop: '-.14285714em' }}
              content={getLocalizedGsimObjectText(language, data[GSIM.NAME])}
              icon={{ name: 'file alternate outline', style: { color: SSB_COLORS.BLUE } }}
            />
            <Divider hidden />
            <Grid
              divided
              columns='equal'
              style={{ border: SSB_COLORS.RED, borderStyle: wasDeleted ? 'dashed' : 'hidden' }}
            >
              {DOMAIN_PROPERTY_GROUPING.map(({ id, test }) =>
                <Grid.Column key={id}>
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
            </Grid>
            <Grid columns='equal'>
              <Grid.Column>
                {!apiReadOnly &&
                <DomainInstanceDelete
                  id={id}
                  domain={domain}
                  wasDeleted={wasDeleted}
                  setWasDeleted={setWasDeleted}
                  name={getLocalizedGsimObjectText(language, data[GSIM.NAME])}
                />
                }
              </Grid.Column>
              <Grid.Column textAlign='right'>
                {!wasDeleted && <DomainInstanceGraph domain={domain} instanceData={data} schema={schema} />}
              </Grid.Column>
            </Grid>
          </>
      }
      {!wasDeleted && ready && !apiReadOnly &&
      <>
        <Divider hidden />
        <DomainInstanceEdit data={data} refetch={refetch} />
      </>
      }
    </>
  )
}

export default DomainInstance

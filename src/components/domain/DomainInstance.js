import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { useParams } from 'react-router-dom'
import { Grid, Header, Loader } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject, InfoPopup } from '@statisticsnorway/dapla-js-utilities'

import { DomainInstanceEdit } from './'
import {
  ApiContext,
  convertDataToView,
  getDomainDisplayName,
  getDomainSchema,
  LanguageContext,
  SchemasContext
} from '../../utilities'
import { API, DOMAIN_PROPERTY_GROUPING, GSIM } from '../../configurations'

function DomainInstance () {
  const { domain, id } = useParams()
  const { restApi } = useContext(ApiContext)
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [schema, setSchema] = useState(getDomainSchema(domain, schemas))
  const [domainInstanceData, setDomainInstanceData] = useState(null)

  const [{ data, loading, error }, refetch] =
    useAxios(`${restApi}${API.GET_DOMAIN_INSTANCE_DATA(domain, id)}`, { manual: true })

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
      <Header size='large' content={getDomainDisplayName(schema)} subheader={id} />
      {loading ? <Loader active inline='centered' /> :
        error ? <ErrorMessage error={error} language={language} /> : ready &&
          <Grid columns='equal' divided>
            <Grid.Row>
              {DOMAIN_PROPERTY_GROUPING.map(({ name, test }) =>
                <Grid.Column key={name}>
                  <Grid>
                    {ready && properties.filter(([property]) => test(property)).map(([property]) => {
                      const { description, name, value } = domainInstanceData[property]

                      return (
                        <Grid.Row key={property}>
                          <Grid.Column textAlign='right' width={5}>
                            <InfoPopup text={description} trigger={<b>{name}</b>} />
                          </Grid.Column>
                          <Grid.Column width={11}>{value}</Grid.Column>
                        </Grid.Row>
                      )
                    }
                    )}
                  </Grid>
                </Grid.Column>
              )}
            </Grid.Row>
            {ready && <DomainInstanceEdit refetch={refetch} data={data} />}
          </Grid>
      }
    </>
  )
}

export default DomainInstance

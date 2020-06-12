import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import AceEditor from 'react-ace'
import { useParams } from 'react-router-dom'
import { Divider, Grid, Header, Loader } from 'semantic-ui-react'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-textmate'

import { ErrorMessage } from '../'
import {
  ApiContext,
  convertDataToView,
  getDomainDisplayName,
  getDomainSchema,
  getNestedObject,
  SchemasContext
} from '../../utilities'
import { API, DOMAIN_PROPERTY_GROUPING, GSIM, infoPopup } from '../../configurations'

function DomainInstance () {
  const { domain, id } = useParams()
  const { restApi } = useContext(ApiContext)
  const { schemas } = useContext(SchemasContext)

  const [ready, setReady] = useState(false)
  const [schema, setSchema] = useState(getDomainSchema(domain, schemas))
  const [domainInstanceData, setDomainInstanceData] = useState(null)
  const [domainInstanceJson, setDomainInstanceJson] = useState(null)

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
        setDomainInstanceJson(JSON.stringify(data, null, 2))
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
        error ? <ErrorMessage error={error} /> : ready &&
          <>
            <Grid columns='equal' divided>
              {DOMAIN_PROPERTY_GROUPING.map(({ name, test }) =>
                <Grid.Column key={name}>
                  <Grid>
                    {ready && domainInstanceData !== null && properties.filter(([property]) => test(property)).map(([property]) => {
                        const { description, name, value } = domainInstanceData[property]

                        return (
                          <Grid.Row key={property}>
                            <Grid.Column textAlign='right' width={5}>
                              {infoPopup(description, <b>{name}</b>)}
                            </Grid.Column>
                            <Grid.Column width={11}>{value}</Grid.Column>
                          </Grid.Row>
                        )
                      }
                    )}
                  </Grid>
                </Grid.Column>
              )}
            </Grid>
            <Divider hidden />
            <AceEditor
              mode='json'
              width='100%'
              fontSize={16}
              theme='textmate'
              showPrintMargin={false}
              name='DomainInstanceEdit'
              value={domainInstanceJson}
              setOptions={{
                showLineNumbers: true,
                tabSize: 2
              }}
            />
          </>
      }
    </>
  )
}

export default DomainInstance

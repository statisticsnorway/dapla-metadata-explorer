import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import AceEditor from 'react-ace'
import { useParams } from 'react-router-dom'
import { Divider, Grid, Header, Loader, Button, Icon, Container } from 'semantic-ui-react'
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
import { API, DOMAIN_PROPERTY_GROUPING, GSIM, infoPopup, SSB_COLORS } from '../../configurations'

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

  const [{ loading: putLoading, error: putError, response: response }, executePut] =
    useAxios({ url: `${restApi}${API.PUT_DOMAIN_INSTANCE_DATA(domain, id)}`, method: 'PUT' }, { manual: true })

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

  useEffect( () => {
    if (!putLoading && putError)  {
      try {
        console.log(putError.message, "message")
        console.log(putError.response, "respons")
        console.log(putError.response.data, "respons.data")
        if (response) {
          console.log(response.data, "data")
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [putLoading, putError, response])

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
            {putError ? <ErrorMessage error={putError}/> :
              <Divider hidden />}

              <AceEditor
                mode='json'
                width='90%'
                fontSize={16}
                theme='textmate'
                showPrintMargin={false}
                name='DomainInstanceEdit'
                value={domainInstanceJson}
                onChange={ value => { setDomainInstanceJson(value) }}
                setOptions={{
                  showLineNumbers: true,
                  tabSize: 1,
                }}
            />
              {/*<Container textAlign='left'>*/ }
              <Button onClick={() => executePut({ data: JSON.parse(domainInstanceJson) })}>
              <Icon name={'save'} size={'big'} style={{ color: SSB_COLORS.GREEN }} />
              </Button>
            {/*</Container>*/}
          </>
      }
    </>
  )
}

export default DomainInstance

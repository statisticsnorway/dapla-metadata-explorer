import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import AceEditor from 'react-ace'
import { useParams } from 'react-router-dom'
import { Button, Grid, Icon } from 'semantic-ui-react'
import { ErrorMessage, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-textmate'

import { ApiContext, LanguageContext } from '../../context/AppContext'
import { API } from '../../configurations'
import { DOMAIN } from '../../enums'

function DomainInstanceEdit ({ data, refetch }) {
  const { language } = useContext(LanguageContext)
  const { ldsApi, apiReadOnly } = useContext(ApiContext)

  const { domain, id } = useParams()

  const [madeChanges, setMadeChanges] = useState(false)
  const [domainInstanceJson, setDomainInstanceJson] = useState('')

  const [{ loading: putLoading, error: putError, response: putResponse }, executePut] =
    useAxios({ url: `${ldsApi}${API.PUT_DOMAIN_INSTANCE_DATA(domain, id)}`, method: 'PUT' }, { manual: true })

  useEffect(() => {
    if (data !== undefined) {
      setDomainInstanceJson(JSON.stringify(data, null, 2))
    }
  }, [data])

  useEffect(() => {
    if (!putLoading && !putError && putResponse !== undefined) {
      if (putResponse.status === 201) {
        setMadeChanges(false)
        refetch()
      }
    }
  }, [putLoading, putError, putResponse, refetch])

  const downloadJson = () => {
    const filename = `${domain}_${id}.json`
    const blob = new Blob([domainInstanceJson], { type: 'text/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Grid.Row>
        <Grid.Column textAlign='right'>
          <Button
            size='large'
            onClick={() => downloadJson()}
            style={{ backgroundColor: SSB_COLORS.PURPLE }}
          >
            <Icon name='download' style={{ paddingRight: '0.5rem' }} />
            {DOMAIN.GET_JSON[language]}
          </Button>
        </Grid.Column>
      </Grid.Row>
      {putError &&
      <Grid.Row>
        <Grid.Column>
          <ErrorMessage error={putError} language={language} />
        </Grid.Column>
      </Grid.Row>
      }
      <Grid.Row>
        <Grid.Column>
          <AceEditor
            mode='json'
            width='100%'
            fontSize={16}
            theme='textmate'
            readOnly={apiReadOnly}
            showPrintMargin={false}
            name='DomainInstanceEdit'
            value={domainInstanceJson}
            onChange={value => {
              setMadeChanges(true)
              setDomainInstanceJson(value)
            }}
            setOptions={{
              tabSize: 2,
              showLineNumbers: true
            }}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row divided={false}>
        <Grid.Column />
        <Grid.Column textAlign='right'>
          <Button
            size='large'
            style={{ backgroundColor: SSB_COLORS.BLUE }}
            disabled={putLoading || !madeChanges || apiReadOnly}
            onClick={() => {
              if (!apiReadOnly) {
                executePut({ data: JSON.parse(domainInstanceJson) })
              }
            }}
          >
            <Icon name='save' style={{ paddingRight: '0.5rem' }} />
            {DOMAIN.SAVE[language]}
          </Button>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}

export default DomainInstanceEdit

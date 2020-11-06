import React, { useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import AceEditor from 'react-ace'
import { useParams } from 'react-router-dom'
import { Button, Grid, Icon } from 'semantic-ui-react'
import { ErrorMessage, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-textmate'

import { API } from '../../configurations'
import { DOMAIN } from '../../enums'

function DomainInstanceEdit ({ data, language, ldsApi, refetch }) {
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

  return (
    <>
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
      <Grid.Row>
        <Grid.Column />
        <Grid.Column textAlign='right'>
          <Button
            size='large'
            disabled={putLoading || !madeChanges}
            style={{ backgroundColor: SSB_COLORS.BLUE }}
            onClick={() => executePut({ data: JSON.parse(domainInstanceJson) })}
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

import React, { useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import AceEditor from 'react-ace'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom'
import { Button, Container, Divider, Header, Icon, Message } from 'semantic-ui-react'
import { ErrorMessage, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-textmate'

import { createEmptyDataObject, getDomainSchema } from '../../utilities'
import { DOMAIN } from '../../enums'
import { API } from '../../configurations'

function DomainInstanceNew ({ language, ldsApi, schemas }) {
  const { domain } = useParams()

  const [id] = useState(uuidv4())
  const [saved, setSaved] = useState(false)
  const [schema] = useState(getDomainSchema(domain, schemas))
  const [data, setData] = useState(JSON.stringify(createEmptyDataObject(schema, id), null, 2))

  const [{ loading, error, response }, executePut] =
    useAxios({ url: `${ldsApi}${API.PUT_DOMAIN_INSTANCE_DATA(domain, id)}`, method: 'PUT' }, { manual: true })

  useEffect(() => {
    if (!loading && !error && response !== undefined) {
      if (response.status === 201) {
        setSaved(true)
      }
    }
  }, [loading, error, response])

  return (
    <>
      <Header size='large' content={domain} subheader={id} />
      {error && <ErrorMessage error={error} language={language} />}
      {saved &&
      <Message
        success
        header={DOMAIN.SUCCESS[language]}
        content={DOMAIN.WAS_SAVED[language]}
        icon={{ name: 'check', style: { color: SSB_COLORS.GREEN } }}
      />
      }
      <AceEditor
        mode='json'
        width='100%'
        value={data}
        fontSize={16}
        theme='textmate'
        showPrintMargin={false}
        name='DomainInstanceNew'
        onChange={value => setData(value)}
        setOptions={{
          tabSize: 2,
          showLineNumbers: true
        }}
      />
      <Divider hidden />
      <Container fluid textAlign='right'>
        <Button
          size='large'
          disabled={loading}
          style={{ backgroundColor: SSB_COLORS.BLUE }}
          onClick={() => executePut({ data: JSON.parse(data) })}
        >
          <Icon name='save' style={{ paddingRight: '0.5rem' }} />
          {DOMAIN.SAVE[language]}
        </Button>
      </Container>
    </>
  )
}

export default DomainInstanceNew

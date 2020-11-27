import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Link } from 'react-router-dom'
import { Button, Confirm, Icon, Message } from 'semantic-ui-react'
import { ErrorMessage, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../../context/AppContext'
import { camelToTitle } from '../../utilities'
import { API, ROUTING } from '../../configurations'
import { DOMAIN } from '../../enums'

function DomainInstanceDelete ({ name, domain, id, wasDeleted, setWasDeleted }) {
  const { ldsApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [confirmOpen, setConfirmOpen] = useState(false)

  const showConfirm = () => setConfirmOpen(true)

  const [{ loading, error, response }, executeDelete] = useAxios(
    {
      url: `${ldsApi}${API.DELETE_DOMAIN_INSTANCE_DATA(domain, id)}`, method: 'DELETE'
    },
    {
      manual: true,
      useCache: false
    }
  )

  useEffect(() => {
    if (!loading && !error && response !== undefined) {
      if (response.status === 200 || response.status === 204) {
        setWasDeleted(true)
        setConfirmOpen(false)
      }
    }
  }, [loading, error, response, setWasDeleted])

  return (
    <>
      <Button
        size='large'
        onClick={() => showConfirm()}
        disabled={loading || wasDeleted}
        style={{ backgroundColor: SSB_COLORS.RED }}
      >
        <Icon name='trash alternate' style={{ paddingRight: '0.5rem' }} />
        {DOMAIN.DELETE[language]}
      </Button>
      {wasDeleted &&
      <Message icon success>
        <Icon name='check' style={{ color: SSB_COLORS.GREEN }} />
        <Message.Content>
          <Message.Header>
            {DOMAIN.SUCCESS[language]}
          </Message.Header>
          {DOMAIN.WAS_DELETED[language]}
          <br />
          <Link to={`${ROUTING.DOMAIN_BASE}${domain}`}>{
            `${DOMAIN.BACK_TO_LIST[language]} '${camelToTitle(domain)}'`}
          </Link>
        </Message.Content>
      </Message>
      }
      {error && <ErrorMessage error={error} language={language} />}
      <Confirm
        open={confirmOpen}
        onConfirm={() => executeDelete()}
        onCancel={() => setConfirmOpen(false)}
        cancelButton={DOMAIN.CANCEL_DELETE[language]}
        confirmButton={DOMAIN.CONFIRM_DELETE[language]}
        content={DOMAIN.DELETE_CONFIRM_MESSAGE[language]}
        header={DOMAIN.DELETE_HEADER(camelToTitle(domain), name)[language]}
      />
    </>
  )
}

export default DomainInstanceDelete

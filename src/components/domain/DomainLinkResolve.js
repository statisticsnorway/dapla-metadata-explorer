import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../../context/AppContext'
import { API, GSIM_DEFINITIONS, ROUTING } from '../../configurations'
import { camelToTitle } from '../../utilities'

function DomainLinkResolve ({ link }) {
  const { ldsApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [resolvedName, setResolvedName] = useState(link)

  const [{ data, loading, error }] = useAxios(`${ldsApi}${API.GET_DOMAIN_INSTANCE_NAME(link)}`)

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      try {
        setResolvedName(GSIM_DEFINITIONS.MULTILINGUAL_TEXT.LANGUAGE_TEXT(data, language))
      } catch (e) {
        console.log(e)
      }
    }
  }, [loading, error, data, language])

  if (loading) {
    return <Loader active size='small' />
  } else {
    if (error) {
      return (
        <>{`${resolvedName} (`}<Icon fitted name='unlink' style={{ color: SSB_COLORS.RED, paddingRight: 0 }} />{`)`}</>
      )
    } else {
      return <Link to={`${ROUTING.DOMAIN_BASE}${link.substr(1)}`}>{camelToTitle(resolvedName)}</Link>
    }
  }
}

export default DomainLinkResolve

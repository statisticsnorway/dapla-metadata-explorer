import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'

import { ApiContext, LanguageContext } from '../../utilities'
import { API, GSIM_DEFINITIONS, ROUTING, SSB_COLORS } from '../../configurations'

function DomainLinkResolve ({ link }) {
  const { restApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [resolvedName, setResolvedName] = useState(link)

  const [{ data, loading, error }] = useAxios(`${restApi}${API.GET_DOMAIN_INSTANCE_NAME(link)}`)

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
        <Link to={`${ROUTING.DOMAIN_BASE}${link.substr(1)}`}>
          {`${resolvedName} (`}<Icon fitted name='unlink' style={{ color: SSB_COLORS.RED }} />{`)`}
        </Link>)
    } else {
      return <Link to={`${ROUTING.DOMAIN_BASE}${link.substr(1)}`}>{resolvedName}</Link>
    }
  }
}

export default DomainLinkResolve

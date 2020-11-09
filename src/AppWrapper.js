import React, { useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Route, Switch } from 'react-router-dom'
import { Loader, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { AppHome } from './components'
import { Import } from './components/domains'
import { Domain, DomainInstance, DomainInstanceNew } from './components/domain'
import { sortSchemas } from './utilities'
import { API, ROUTING } from './configurations'
import { UI } from './enums'

function AppWrapper ({ language, ldsApi }) {
  const [ready, setReady] = useState(false)
  const [schemas, setSchemas] = useState(null)

  const [{ data, loading, error }] = useAxios(`${ldsApi}${API.GET_SCHEMAS_EMBED}`, { useCache: false })

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      try {
        setSchemas(sortSchemas(data))
        setReady(true)
      } catch (e) {
        setReady(false)
        console.log(`Could not set schemas: ${e}`)
      }
    } else {
      setReady(false)
    }
  }, [data, error, loading, setSchemas])

  return (
    <Segment basic>
      {loading ? <Loader active inline='centered' /> :
        error ? <ErrorMessage error={UI.API_ERROR_MESSAGE[language]} language={language} /> : ready &&
          <>
            <AppHome language={language} schemas={schemas} />
            <Switch>
              <Route path={ROUTING.DOMAIN_INSTANCE_NEW}>
                <DomainInstanceNew language={language} ldsApi={ldsApi} schemas={schemas} />
              </Route>
              <Route path={ROUTING.DOMAIN_INSTANCE}>
                <DomainInstance language={language} ldsApi={ldsApi} schemas={schemas} />
              </Route>
              <Route path={ROUTING.DOMAIN}>
                <Domain language={language} ldsApi={ldsApi} schemas={schemas} />
              </Route>
              <Route path={ROUTING.IMPORT}>
                <Import language={language} ldsApi={ldsApi} />
              </Route>
            </Switch>
          </>
      }
    </Segment>
  )
}

export default AppWrapper

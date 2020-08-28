import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Route, Switch } from 'react-router-dom'
import { Divider, Loader, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { AppHome, AppMenu, AppSettings, Domain, DomainInstance, DomainInstanceNew } from './components'
import { ApiContext, LanguageContext, SchemasContext, sortSchemas } from './utilities'
import { API, ROUTING } from './configurations'
import { UI } from './enums'

function App () {
  const { restApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)
  const { setSchemas } = useContext(SchemasContext)

  const [apiReady, setApiReady] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [{ data, loading, error }] = useAxios(`${restApi}${API.GET_SCHEMAS}`, { useCache: false })

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      try {
        setSchemas(sortSchemas(data))
        setApiReady(true)
      } catch (e) {
        setApiReady(false)
        console.log(`Could not set schemas: ${e}`)
      }
    } else {
      setApiReady(false)
    }
  }, [data, error, loading, setSchemas])

  return (
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} ready={apiReady} />
      <Divider />
      <Segment basic>
        {loading ? <Loader active inline='centered' /> :
          error ? <ErrorMessage error={UI.API_ERROR_MESSAGE[language]} language={language} /> : apiReady &&
            <Switch>
              <Route path={ROUTING.DOMAIN_INSTANCE_NEW}>
                <DomainInstanceNew />
              </Route>
              <Route path={ROUTING.DOMAIN_INSTANCE}>
                <DomainInstance />
              </Route>
              <Route path={ROUTING.DOMAIN}>
                <Domain />
              </Route>
              <Route path={ROUTING.BASE}>
                <AppHome />
              </Route>
            </Switch>
        }
      </Segment>
      <AppSettings error={error} loading={loading} setSettingsOpen={setSettingsOpen} open={settingsOpen} />
    </>
  )
}

export default App

import React, { useContext, useEffect, useRef, useState } from 'react'
import useAxios from 'axios-hooks'
import { Route, Switch } from 'react-router-dom'
import { Loader, Ref, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { AppHome, AppMenu, AppSettings, Domain, DomainInstance, DomainInstanceNew, Import } from './components'
import { ApiContext, LanguageContext, SchemasContext } from './context/AppContext'
import { sortSchemas } from './utilities'
import { API, ROUTING } from './configurations'
import { UI } from './enums'

function App () {
  const { ldsApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)
  const { setSchemas } = useContext(SchemasContext)

  const appRefArea = useRef()

  const [ready, setReady] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

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
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} context={appRefArea} />
      <Ref innerRef={appRefArea}>
        {loading ? <Loader active inline='centered' /> : error ?
          <Segment basic><ErrorMessage error={UI.API_ERROR_MESSAGE[language]} language={language} /></Segment> : ready ?
            <Segment basic style={{ paddingBottom: '5rem' }}>
              <AppHome />
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
                <Route path={ROUTING.IMPORT}>
                  <Import />
                </Route>
              </Switch>
            </Segment>
            : <Segment basic />
        }
      </Ref>
      <AppSettings error={error} loading={loading} setOpen={setSettingsOpen} open={settingsOpen} />
    </>
  )
}

export default App

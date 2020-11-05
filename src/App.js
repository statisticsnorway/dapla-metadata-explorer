import React, { useContext, useRef, useState } from 'react'
import useAxios from 'axios-hooks'
import { Loader, Ref } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import AppWrapper from './AppWrapper'
import { AppMenu, AppSettings } from './components'
import { ApiContext, LanguageContext } from './context/AppContext'
import { API } from './configurations'
import { UI } from './enums'

function App () {
  const { ldsApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const appRefArea = useRef()

  const [settingsOpen, setSettingsOpen] = useState(false)

  const [{ loading, error }] = useAxios(`${ldsApi}${API.GET_HEALTH}`, { useCache: false })

  return (
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} context={appRefArea} />
      <Ref innerRef={appRefArea}>
        {loading ? <Loader active inline='centered' /> :
          error ? <ErrorMessage error={UI.API_ERROR_MESSAGE[language]} language={language} /> :
            <AppWrapper language={language} ldsApi={ldsApi} />
        }
      </Ref>
      <AppSettings error={error} loading={loading} setOpen={setSettingsOpen} open={settingsOpen} />
    </>
  )
}

export default App

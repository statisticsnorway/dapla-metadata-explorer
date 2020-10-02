import React, { useContext } from 'react'
import { Dropdown, Header, Icon, Modal, Segment } from 'semantic-ui-react'
import { ErrorMessage, SimpleFooter, SSB_COLORS, SSB_STYLE } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../context/AppContext'
import { SETTINGS } from '../enums'

function AppSettings ({ error, loading, open, setSettingsOpen }) {
  const { language } = useContext(LanguageContext)
  const { ldsApi, setLdsApi } = useContext(ApiContext)

  const options = [window._env.REACT_APP_EXPLORATION_LDS, window._env.REACT_APP_CONCEPT_LDS].map((lds, index) => ({
    key: index,
    text: ['Exploration LDS', 'Concept LDS'][index],
    value: lds,
    content: (<Header size='small' content={['Exploration LDS', 'Concept LDS'][index]} subheader={lds} />)
  }))

  return (
    <Modal open={open} onClose={() => setSettingsOpen(false)} style={SSB_STYLE}>
      <Header size='large' style={SSB_STYLE}>
        <Icon name='cog' style={{ color: SSB_COLORS.GREEN }} />
        {SETTINGS.HEADER[language]}
      </Header>
      <Modal.Content as={Segment} basic style={SSB_STYLE}>
        <Dropdown
          fluid
          selection
          value={ldsApi}
          options={options}
          loading={loading}
          error={!loading && !!error}
          placeholder={SETTINGS.API[language]}
          onChange={(e, { value }) => setLdsApi(value)}
        />
        {!loading && error && <ErrorMessage error={error} language={language} />}
      </Modal.Content>
      <Segment basic>
        <SimpleFooter
          language={language}
          appVersion={process.env.REACT_APP_VERSION}
          sourceUrl={process.env.REACT_APP_SOURCE_URL}
        />
      </Segment>
    </Modal>
  )
}

export default AppSettings

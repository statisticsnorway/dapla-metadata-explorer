import React, { useContext } from 'react'
import { Divider, Dropdown, Header, Icon, Input, Modal, Segment } from 'semantic-ui-react'
import { ErrorMessage, SimpleFooter, SSB_COLORS, SSB_STYLE } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext, UserContext } from '../context/AppContext'
import { API } from '../configurations'
import { SETTINGS } from '../enums'

function AppSettings ({ error, loading, open, setOpen }) {
  const { language } = useContext(LanguageContext)
  const { user, setUser } = useContext(UserContext)
  const { ldsApi, setLdsApi } = useContext(ApiContext)

  const options = [window._env.REACT_APP_EXPLORATION_LDS, window._env.REACT_APP_CONCEPT_LDS].map((lds, index) => ({
    key: index,
    text: API.LDS[index],
    value: lds,
    content: (<Header size='small' content={API.LDS[index]} subheader={lds} />)
  }))

  return (
    <Modal open={open} onClose={() => setOpen(false)} style={SSB_STYLE}>
      <Header size='large' style={SSB_STYLE}>
        <Icon name='cog' style={{ color: SSB_COLORS.GREEN }} />
        {SETTINGS.HEADER[language]}
      </Header>
      <Modal.Content as={Segment} basic style={SSB_STYLE}>
        <Input
          icon={{ name: 'user', style: { color: SSB_COLORS.BLUE } }}
          iconPosition='left'
          onChange={(e, { value }) => {
            localStorage.setItem('user', value)
            setUser(value)
          }}
          placeholder={SETTINGS.USER[language]}
          value={user}
        />
        <Divider hidden />
        <Dropdown
          fluid
          selection
          value={ldsApi}
          options={options}
          loading={loading}
          error={!loading && !!error}
          placeholder={SETTINGS.API[language]}
          onChange={(e, { value }) => {
            localStorage.setItem('lds', value)
            setLdsApi(value)
          }}
        />
        {!loading && error && <ErrorMessage error={error} language={language} />}
      </Modal.Content>
      <SimpleFooter
        language={language}
        showScrollToTop={false}
        appVersion={process.env.REACT_APP_VERSION}
        sourceUrl={process.env.REACT_APP_SOURCE_URL}
      />
    </Modal>
  )
}

export default AppSettings

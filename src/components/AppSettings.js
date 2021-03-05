import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Checkbox, Divider, Form, Header, Icon, Modal, Segment } from 'semantic-ui-react'
import { ErrorMessage, InfoPopup, SimpleFooter, SSB_COLORS, SSB_STYLE } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext, UserContext } from '../context/AppContext'
import { API, STORAGE } from '../configurations'
import { SETTINGS, TEST_IDS } from '../enums'

function AppSettings ({ error, loading, open, setOpen }) {
  const { language } = useContext(LanguageContext)
  const { user, setUser } = useContext(UserContext)
  const { ldsApi, setLdsApi, setGraphqlApi, setApiReadOnly, showUnnamed, setShowUnnamed } = useContext(ApiContext)

  let history = useHistory()

  const options = [window.__ENV.REACT_APP_EXPLORATION_LDS, window.__ENV.REACT_APP_CONCEPT_LDS].map((lds, index) => ({
    key: index,
    text: API.LDS[index],
    value: lds,
    content: (<Header size='small' content={API.LDS[index]} subheader={lds} />)
  }))

  return (
    <Modal open={open} onClose={() => setOpen(false)} style={SSB_STYLE} centered={false}>
      <Header size='large' style={SSB_STYLE}>
        <Icon name='cog' style={{ color: SSB_COLORS.GREEN }} />
        {SETTINGS.HEADER[language]}
      </Header>
      <Modal.Content as={Segment} basic style={SSB_STYLE}>
        <Form size='large'>
          <Form.Group widths='equal'>
            <Form.Input
              value={user}
              iconPosition='left'
              label={SETTINGS.USER[language]}
              placeholder={SETTINGS.USER[language]}
              icon={{ name: 'user', style: { color: SSB_COLORS.BLUE } }}
              onChange={(e, { value }) => {
                localStorage.setItem(STORAGE.USER, value)
                setUser(value)
              }}
            />
            <Form.Select
              fluid
              size='large'
              value={ldsApi}
              options={options}
              loading={loading}
              error={!loading && !!error}
              label={SETTINGS.API[language]}
              placeholder={SETTINGS.API[language]}
              onChange={(e, { value }) => {
                history.push('/')
                localStorage.setItem(STORAGE.LDS, value)
                setLdsApi(value)
                setGraphqlApi(`${value}${API.GRAPHQL}`)

                if (value === window.__ENV.REACT_APP_EXPLORATION_LDS) {
                  setApiReadOnly(true)
                } else {
                  setApiReadOnly(false)
                }
              }}
            />
          </Form.Group>
          <Divider hidden />
          <Form.Field>
            <InfoPopup
              text={SETTINGS.SHOW_UNNAMED_DESCRIPTION[language]}
              trigger={<label>{SETTINGS.SHOW_UNNAMED[language]}</label>}
            />
            <Checkbox
              toggle
              defaultChecked={showUnnamed}
              data-testid={TEST_IDS.SHOW_UNNAMED_RESOURCES_TOGGLE}
              onChange={() => {
                localStorage.setItem(STORAGE.SHOW_UNNAMED, showUnnamed ? 'false' : 'true')
                setShowUnnamed(!showUnnamed)
              }}
            />
          </Form.Field>
        </Form>
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

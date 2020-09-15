import React, { useContext, useState } from 'react'
import { Button, Container, Divider, Form, Grid, Header, Icon, Modal, Segment } from 'semantic-ui-react'
import {
  ErrorMessage,
  InfoPopup,
  InfoText,
  SimpleFooter,
  SSB_COLORS,
  SSB_STYLE
} from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../context/AppContext'
import { API } from '../configurations'
import { SETTINGS, TEST_IDS } from '../enums'

function AppSettings ({ error, loading, open, setSettingsOpen }) {
  const { language } = useContext(LanguageContext)
  const { restApi, setRestApi, graphqlApi, setGraphqlApi } = useContext(ApiContext)

  const [apiUrl, setApiUrl] = useState(restApi)
  const [graphqlApiUrl, setGraphqlApiUrl] = useState(graphqlApi)
  const [settingsEdited, setSettingsEdited] = useState(false)

  const applySettings = () => {
    setRestApi(apiUrl)
    setGraphqlApi(graphqlApiUrl)
    setSettingsEdited(false)
  }

  const changeSettings = (value) => {
    setApiUrl(value)
    setGraphqlApiUrl(`${value}${API.GRAPHQL}`)
    setSettingsEdited(true)
  }

  const setDefaults = () => {
    setSettingsEdited(true)
    setApiUrl(window._env.REACT_APP_API)
    setGraphqlApiUrl(`${window._env.REACT_APP_API}${API.GRAPHQL}`)
  }

  return (
    <Modal open={open} onClose={() => setSettingsOpen(false)} style={SSB_STYLE}>
      <Header size='large' style={SSB_STYLE}>
        <Icon name='cog' style={{ color: SSB_COLORS.GREEN }} />
        {SETTINGS.HEADER[language]}
      </Header>
      <Modal.Content as={Segment} basic style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            value={apiUrl}
            loading={loading}
            label={SETTINGS.API[language]}
            error={!!error && !settingsEdited}
            placeholder={SETTINGS.API[language]}
            onChange={(event, { value }) => changeSettings(value)}
            onKeyPress={({ key }) => key === 'Enter' && applySettings()}
            icon={!loading && !settingsEdited && !error ?
              <Icon name='check' style={{ color: SSB_COLORS.GREEN }} /> : null
            }
          />
        </Form>
        {!loading && !settingsEdited && error && <ErrorMessage error={error} language={language} />}
        {!loading && settingsEdited &&
        <Container style={{ marginTop: '0.5rem' }}>
          <InfoText text={SETTINGS.EDITED_VALUES[language]} />
        </Container>
        }
        <Container style={{ marginTop: '1rem' }}>
          <Divider hidden />
          <Grid columns='equal'>
            <Grid.Column>
              <Button primary size='large' disabled={loading} onClick={() => applySettings()}>
                <Icon name='sync' style={{ paddingRight: '0.5rem' }} />
                {SETTINGS.APPLY[language]}
              </Button>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <InfoPopup
                position='left center'
                text={SETTINGS.RESET_SETTINGS[language]}
                trigger={
                  <Icon
                    link
                    fitted
                    name='undo'
                    size='large'
                    onClick={() => setDefaults()}
                    style={{ color: SSB_COLORS.BLUE }}
                    data-testid={TEST_IDS.DEFAULT_SETTINGS_BUTTON}
                  />
                }
              />
            </Grid.Column>
          </Grid>
        </Container>
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

import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Divider, Grid, Icon, List, Segment, Transition } from 'semantic-ui-react'
import { InfoText } from '@statisticsnorway/dapla-js-utilities'

import AppSearch from './AppSearch'
import { DomainsGraph, DomainsList } from './domains'
import { LanguageContext, SchemasContext } from '../context/AppContext'
import { HOME, TEST_IDS } from '../enums'

function AppHome () {
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)

  let location = useLocation()

  const [visible, setVisible] = useState(location.pathname === '/')
  const [burgerVisible, setBurgerVisible] = useState(location.pathname !== '/')

  const informationRows = [
    {
      text: HOME.LOADED_DOMAINS[language],
      value: ({ groups }) =>
        Object.entries(groups).map(group => group)
          .reduce((accumulator, group) => accumulator + group[1].length, 0)
    },
    { text: HOME.VERSION[language], value: ({ version }) => version },
    { text: HOME.CHANGELOG[language], value: ({ changelog }) => changelog }
  ]

  useEffect(() => {
    if (location.pathname !== '/') {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }, [location])

  return (
    <>
      <Transition duration={300} visible={visible} animation='fade down' onHide={() => setBurgerVisible(true)}>
        <div style={{ marginBottom: '3rem' }}>
          <Segment attached>
            <Grid columns='equal'>
              <Grid.Row>
                <Grid.Column>
                  <AppSearch />
                  <Divider hidden style={{ margin: '0.2rem 0 0 0' }} />
                  <InfoText text={HOME.CHOOSE_OR_SEARCH[language]} />
                </Grid.Column>
                <Grid.Column>
                  <Grid columns='equal'>
                    <Grid.Column>
                      <List relaxed>
                        {informationRows.map(({ text, value }) =>
                          <List.Item key={text}>
                            <b>{`${text}: `}</b>
                            {value(schemas)}
                          </List.Item>
                        )}
                      </List>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' textAlign='right'>
                      <DomainsGraph />
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
              <Divider />
              <Grid.Row>
                <Grid.Column>
                  <DomainsList />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          <Button
            compact
            size='tiny'
            icon='caret up'
            attached='bottom'
            onClick={() => setVisible(false)}
            style={{ width: '15%', left: '42.5%' }}
            data-testid={TEST_IDS.HIDE_APP_HOME_BUTTON}
          />
        </div>
      </Transition>
      {burgerVisible &&
      <Icon
        link
        size='big'
        name='bars'
        data-testid={TEST_IDS.SHOW_APP_HOME_BUTTON}
        onClick={() => {
          setVisible(!visible)
          setBurgerVisible(false)
        }}
      />
      }
      <Divider hidden={!visible} />
    </>
  )
}

export default AppHome

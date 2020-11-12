import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Divider, Grid, Icon, List, Segment, Transition } from 'semantic-ui-react'
import { InfoText } from '@statisticsnorway/dapla-js-utilities'

import AppSearch from './AppSearch'
import { DomainsList } from './domains'
import { LanguageContext, SchemasContext } from '../context/AppContext'
import { HOME } from '../enums'

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
      <Transition visible={visible} animation='fade down' duration={300} onHide={() => setBurgerVisible(true)}>
        <div>
          <Segment attached>
            <Grid columns='equal'>
              <Grid.Row>
                <Grid.Column>
                  <AppSearch />
                  <InfoText text={HOME.CHOOSE_OR_SEARCH[language]} />
                </Grid.Column>
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
              </Grid.Row>
              <Divider hidden />
              <Grid.Row>
                <Grid.Column>
                  <DomainsList />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          <Button
            icon='caret up'
            attached='bottom'
            style={{ background: '#fff' }}
            onClick={() => setVisible(false)}
          />
        </div>
      </Transition>
      {burgerVisible &&
      <Icon
        link
        size='big'
        name='bars'
        onClick={() => {
          setVisible(!visible)
          setBurgerVisible(false)
        }}
      />
      }
      <Divider hidden />
    </>
  )
}

export default AppHome

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Divider, Grid, Icon, List, Segment, Transition } from 'semantic-ui-react'
import { InfoText } from '@statisticsnorway/dapla-js-utilities'

import AppSearch from './AppSearch'
import { DomainsList } from './domains'
import { HOME } from '../enums'

function AppHome ({ language, schemas }) {
  let location = useLocation()

  const [visible, setVisible] = useState(true)

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
      <Transition visible={visible} animation='fade down' duration={300}>
        <Segment>
          <Grid columns='equal'>
            <Grid.Row>
              <Grid.Column>
                <AppSearch schemas={schemas} />
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
                <DomainsList schemas={schemas} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Transition>
      {!visible && <Icon size='big' name='bars' link onClick={() => setVisible(!visible)} />}
      <Divider hidden />
    </>
  )
}

export default AppHome

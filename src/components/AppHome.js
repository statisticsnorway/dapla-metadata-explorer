import React, { useContext } from 'react'
import { Divider, Grid, Header } from 'semantic-ui-react'

import { DomainsChart, DomainsList } from './domains'
import { LanguageContext, SchemasContext } from '../utilities'
import { HOME, UI } from '../enums'

function AppHome () {
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)

  const informationRows = [
    {
      text: HOME.LOADED_DOMAINS[language],
      value: ({ groups }) =>
        Object.entries(groups).map(group => group)
          .reduce((accumulator, group) => accumulator + group[1].length, 0)
    },
    { text: UI.VERSION[language], value: ({ version }) => version },
    { text: HOME.CHANGELOG[language], value: ({ changelog }) => changelog }
  ]

  return (
    <Grid columns='equal'>
      {informationRows.map(({ text, value }) =>
        <Grid.Row key={text} verticalAlign='middle'>
          <Grid.Column textAlign='right'><Header size='small' content={text} /></Grid.Column>
          <Grid.Column>{value(schemas)}</Grid.Column>
        </Grid.Row>
      )}
      <Divider hidden />
      <Grid.Row>
        <Grid.Column>
          <DomainsList />
        </Grid.Column>
        <Grid.Column>
          <Divider hidden />
          <DomainsChart />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default AppHome

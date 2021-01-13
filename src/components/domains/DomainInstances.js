import React, { useContext, useState } from 'react'
import { Button, Checkbox, Container, Divider, Grid, Header, Icon, List } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import DomainInstancesNew from './DomainInstancesNew'
import { LanguageContext, SchemasContext } from '../../context/AppContext'
import { camelToTitle, getDomainRef } from '../../utilities'
import { DOMAINS, HOME } from '../../enums'

function DomainInstances () {
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [selectedDomains, setSelectedDomains] = useState([])

  const handleCheckbox = (includes, domain) => {
    if (includes) {
      setSelectedDomains(selectedDomains.filter(element => element !== domain))
    } else {
      setSelectedDomains(selectedDomains.concat([domain]))
    }
  }

  return (
    <Container fluid>
      <Header
        size='large'
        subheader={DOMAINS.SUB_HEADER[language]}
        content={HOME.MULTI_CREATE_DOMAIN_INSTANCES[language]}
        icon={{ name: 'edit outline', style: { color: SSB_COLORS.BLUE } }}
      />
      <Divider hidden />
      {!ready &&
      <Grid columns='equal'>
        <Grid.Row>
          {Object.entries(schemas.groups).filter(([group, schemasByGroup]) => schemasByGroup.length !== 0)
            .map(([group, schemasByGroup]) =>
              <Grid.Column key={group}>
                <List>
                  {schemasByGroup.map(domain => {
                    const domainName = getDomainRef(domain)
                    const includes = selectedDomains.includes(domainName)

                    return (
                      <List.Item key={domainName}>
                        <Checkbox
                          checked={includes}
                          label={camelToTitle(domainName)}
                          onClick={() => handleCheckbox(includes, domainName)}
                        />
                      </List.Item>
                    )
                  })}
                </List>
              </Grid.Column>
            )
          }
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='right'>
            <Button
              size='large'
              onClick={() => setReady(true)}
              disabled={selectedDomains.length <= 1}
              style={{ backgroundColor: SSB_COLORS.BLUE }}
            >
              <Icon name='pencil alternate' style={{ paddingRight: '0.5rem' }} />
              {DOMAINS.START[language]}
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      }
      {ready && <DomainInstancesNew domains={selectedDomains} />}
    </Container>
  )
}

export default DomainInstances

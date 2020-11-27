import React, { useContext, useState } from 'react'
import { Accordion, Checkbox, Divider, Grid, Header, Icon, List, Segment } from 'semantic-ui-react'
import { getNestedObject, InfoPopup, InfoText, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../context/AppContext'
import { DOMAIN_PROPERTY_GROUPING, GSIM, STORAGE } from '../../configurations'
import { DOMAIN, TEST_IDS } from '../../enums'
import { camelToTitle, getDomainRef } from '../../utilities'

function DomainTableHeaders ({ headers, schema, setHeaders }) {
  const { language } = useContext(LanguageContext)

  const [accordionOpen, setAccordionOpen] = useState(false)

  const properties = Object.entries(getNestedObject(schema, GSIM.PROPERTIES(schema)))

  const handleCheckbox = (includes, property) => {
    if (includes) {
      const filteredHeaders = headers.filter(element => element !== property)

      setHeaders(filteredHeaders)
      localStorage.setItem(STORAGE.DOMAIN_TABLE_HEADERS(getDomainRef(schema)), filteredHeaders.join())
    } else {
      const newHeaders = headers.concat([property])

      setHeaders(newHeaders)
      localStorage.setItem(STORAGE.DOMAIN_TABLE_HEADERS(getDomainRef(schema)), newHeaders.join())
    }
  }

  return (
    <Accordion styled fluid>
      <Accordion.Title active={accordionOpen} onClick={() => setAccordionOpen(!accordionOpen)}>
        <Icon name='dropdown' />
        {DOMAIN.ADJUST_TABLE_HEADERS[language]}
      </Accordion.Title>
      <Accordion.Content active={accordionOpen}>
        <Segment basic style={{ padding: 0, marginBottom: 0 }}>
          <Grid columns='equal' divided>
            {DOMAIN_PROPERTY_GROUPING.map(({ id, getName, description, test }) => {
                const filteredProperties = properties.filter(([property]) => test(property) && property !== GSIM.ID)
                const indexToSplit = Math.ceil(filteredProperties.length / 2)
                const firstColumn = filteredProperties.slice(0, indexToSplit)
                const secondColumn = filteredProperties.slice(indexToSplit)

                return (
                  <Grid.Column key={id}>
                    <Header content={getName(language)} subheader={description(language)} />
                    <Divider hidden />
                    <Grid columns='equal'>
                      {[firstColumn, secondColumn].map((column, index) =>
                        <Grid.Column key={index}>
                          <List>
                            {column.filter(([property]) => test(property)).map(([property, object]) => {
                                const includes = headers.includes(property)

                                return (
                                  <List.Item key={property}>
                                    <InfoPopup
                                      position='top left'
                                      text={object.description}
                                      trigger={
                                        <Checkbox
                                          key={property}
                                          checked={includes}
                                          label={camelToTitle(property)}
                                          style={{ marginRight: '1rem' }}
                                          onClick={() => handleCheckbox(includes, property)}
                                        />
                                      }
                                    />
                                  </List.Item>
                                )
                              }
                            )}
                          </List>
                        </Grid.Column>
                      )}
                    </Grid>
                  </Grid.Column>
                )
              }
            )}
          </Grid>
        </Segment>
        <Grid columns='equal'>
          <Grid.Column>
            <InfoText text={DOMAIN.COLUMN_CHOICE[language]} />
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <InfoPopup
              position='left center'
              text={DOMAIN.RESET_HEADERS[language]}
              trigger={
                <Icon
                  link
                  fitted
                  name='undo'
                  size='large'
                  style={{ color: SSB_COLORS.BLUE }}
                  data-testid={TEST_IDS.DEFAULT_TABLE_HEADERS}
                  onClick={() => {
                    setHeaders(GSIM.DEFAULT_TABLE_HEADERS)
                    localStorage.setItem(
                      STORAGE.DOMAIN_TABLE_HEADERS(getDomainRef(schema)),
                      GSIM.DEFAULT_TABLE_HEADERS.join()
                    )
                  }}
                />
              }
            />
          </Grid.Column>
        </Grid>
      </Accordion.Content>
    </Accordion>
  )
}

export default DomainTableHeaders

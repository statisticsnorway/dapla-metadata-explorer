import React, { useContext, useState } from 'react'
import { Accordion, Checkbox, Divider, Grid, Header, Icon, Label, List, Segment } from 'semantic-ui-react'
import { getNestedObject, InfoPopup, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../context/AppContext'
import { DOMAIN_PROPERTY_GROUPING, GSIM } from '../../configurations'
import { DOMAIN, TEST_IDS } from '../../enums'
import { camelToTitle } from '../../utilities'

function DomainTableHeaders ({ headers, schema, setHeaders, setTrunc }) {
  const { language } = useContext(LanguageContext)

  const [accordionOpen, setAccordionOpen] = useState(false)

  const properties = Object.entries(getNestedObject(schema, GSIM.PROPERTIES(schema)))

  const handleCheckbox = (includes, property) => {
    if (includes) {
      const filteredHeaders = headers.filter(element => element !== property)

      setHeaders(filteredHeaders)
      setTrunc(200 / filteredHeaders.length)
    } else {
      const newHeaders = headers.concat([property])

      setHeaders(newHeaders)
      setTrunc(200 / newHeaders.length)
    }
  }

  return (
    <Accordion>
      <Accordion.Title active={accordionOpen} onClick={() => setAccordionOpen(!accordionOpen)}>
        <Icon name='dropdown' />
        {DOMAIN.ADJUST_TABLE_HEADERS[language]}
      </Accordion.Title>
      <Accordion.Content active={accordionOpen}>
        <Segment>
          <Label attached='bottom right' style={{ background: 'transparent' }}>
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
                    setTrunc(200 / GSIM.DEFAULT_TABLE_HEADERS.length)
                  }}
                />
              }
            />
          </Label>
          <Grid columns='equal' divided>
            {DOMAIN_PROPERTY_GROUPING.map(({ name, description, test }) => {
                const filteredProperties = properties.filter(([property]) => test(property))
                const indexToSplit = filteredProperties.length / 2
                const firstColumn = filteredProperties.slice(0, indexToSplit)
                const secondColumn = filteredProperties.slice(indexToSplit + 1)

                return (
                  <Grid.Column key={name}>
                    <InfoPopup
                      text={description(language)}
                      trigger={<Header content={name} />}
                    />
                    <Grid columns='equal'>
                      {[firstColumn, secondColumn].map((column, index) =>
                        <Grid.Column key={index}>
                          <List>
                            {column.filter(([property]) => test(property)).map(([property, object]) => {
                                const includes = headers.includes(property)

                                return property === GSIM.ID ? null :
                                  <List.Item key={property}>
                                    <InfoPopup
                                      position='top left'
                                      text={object.description}
                                      trigger={
                                        <Checkbox
                                          key={property}
                                          label={camelToTitle(property)}
                                          checked={includes}
                                          style={{ marginRight: '1rem' }}
                                          onClick={() => handleCheckbox(includes, property)}
                                        />
                                      }
                                    />
                                  </List.Item>
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
        <Divider hidden style={{ marginBottom: 0 }} />
      </Accordion.Content>
    </Accordion>
  )
}

export default DomainTableHeaders

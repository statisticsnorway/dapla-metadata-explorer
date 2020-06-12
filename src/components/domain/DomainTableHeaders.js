import React, { useContext, useState } from 'react'
import { Accordion, Checkbox, Divider, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react'

import { getNestedObject, LanguageContext } from '../../utilities'
import { DOMAIN_PROPERTY_GROUPING, GSIM, infoPopup, SSB_COLORS } from '../../configurations'
import { DOMAIN, TEST_IDS } from '../../enums'

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
            {infoPopup(
              DOMAIN.RESET_HEADERS[language],
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
              />,
              'left center'
            )}
          </Label>
          <Grid columns='equal' divided>
            {DOMAIN_PROPERTY_GROUPING.map(({ name, description, test }) =>
              <Grid.Column key={name}>
                {infoPopup(description(language), <Header content={name} />)}
                {properties.filter(([property]) => test(property)).map(([property, object]) => {
                    const includes = headers.includes(property)

                    return property === GSIM.ID ? null : infoPopup(
                      object.description,
                      <Checkbox
                        key={property}
                        checked={includes}
                        label={object.displayName !== '' ? object.displayName : property}
                        style={{ marginRight: '0.5em' }}
                        onClick={() => handleCheckbox(includes, property)}
                      />,
                      'top left',
                      property
                    )
                  }
                )}
              </Grid.Column>
            )}
          </Grid>
        </Segment>
        <Divider hidden style={{ marginBottom: 0 }} />
      </Accordion.Content>
    </Accordion>
  )
}

export default DomainTableHeaders

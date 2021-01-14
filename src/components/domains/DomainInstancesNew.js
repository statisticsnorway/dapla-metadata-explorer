import React, { Fragment, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useForm } from 'react-hook-form'
import { Button, Divider, Form, Grid, Header, Icon, List, Message, Segment } from 'semantic-ui-react'
import { getNestedObject, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext, SchemasContext, UserContext } from '../../context/AppContext'
import { DOMAIN_PROPERTY_GROUPING } from '../../configurations'
import { FormInputs } from '../form'
import {
  camelToTitle,
  convertSchemaToEdit,
  createEmptyDataObject,
  getDomainDescription,
  getDomainSchema
} from '../../utilities'
import { DOMAIN, DOMAINS } from '../../enums'

function DomainInstancesNew ({ domains }) {
  const { user } = useContext(UserContext)
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)
  const { apiReadOnly } = useContext(ApiContext)

  const [edited, setEdited] = useState(false)
  const [formConnections, setFormConnections] = useState(false)
  const [formConfiguration] = useState(domains.reduce((accumulator, current) => ({
    ...accumulator, [current]: convertSchemaToEdit({}, getDomainSchema(current, schemas), current)
  }), {}))
  const [formData] = useState(domains.reduce((accumulator, current) => ({
    ...accumulator, [current]: createEmptyDataObject(uuidv4(), user)
  }), {}))

  const { register, handleSubmit, setValue, formState } = useForm()

  useEffect(() => {
    const formConnections = {}

    Object.entries(formConfiguration).forEach(([domain, domainSchema]) => {
      Object.entries(domainSchema).forEach(([entry, entryData]) => {
        if (getNestedObject(entryData, ['configuration', 'options', 'isLink']) !== undefined) {
          if (entryData.configuration.options.links.some(link => domains.includes(link))) {
            const theLink = entryData.configuration.options.links.filter(link => domains.includes(link))

            if (entryData.required) {
              if (formConnections[domain] !== undefined) {
                formConnections[domain] = formConnections[domain].concat(theLink)
              } else {
                formConnections[domain] = theLink
              }
            }
          }
        }
      })
    })

    setFormConnections(formConnections)
  }, [domains, formConfiguration])

  useEffect(() => {
    if (formState.isDirty) {
      setEdited(true)
    }
  }, [formState.isDirty])

  const onSubmit = submittedFormData => {
    console.log(formData)
    console.log(submittedFormData)
  }

  const downloadJson = () => {
    console.log(formConfiguration)
  }

  return (
    <>
      <Grid columns='equal'>
        <Grid.Column>
          {formConnections &&
          <Segment>
            <Header size='small' content={DOMAINS.LINKS[language]} />
            <List size='large' relaxed>
              {Object.entries(formConnections).map(([domain, connection]) =>
                <List.Item key={domain}>
                  {camelToTitle(domain)}
                  <Icon.Group style={{ color: SSB_COLORS.GREY, marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                    <Icon name='linkify' />
                    <Icon corner name='arrow right' />
                  </Icon.Group>
                  {connection.join(', ')}
                </List.Item>
              )}
            </List>
          </Segment>
          }
        </Grid.Column>
        <Grid.Column>
          <Segment>
            <i>TODO: Muligheter her for å velge hvilke av de man lager her man vil koble til de andre man lager her?</i>
          </Segment>
        </Grid.Column>
      </Grid>
      <Divider hidden />
      {edited && <Message warning content={DOMAIN.WAS_EDITED[language]} />}
      <Divider hidden />
      <Form size='large' onSubmit={handleSubmit(onSubmit)}>
        <Grid columns='equal' divided>
          {domains.map(domain =>
            <Fragment key={domain}>
              <Header content={camelToTitle(domain)}
                      subheader={getDomainDescription(getDomainSchema(domain, schemas))}
              />
              <Grid.Row>
                {DOMAIN_PROPERTY_GROUPING.filter(group => group.id !== 'AUTOFILLED').map(({ id, test }) =>
                  <Grid.Column key={id}>
                    {Object.entries(formConfiguration[domain]).filter(([item, schema]) => test(item) && schema.required)
                      .map(([item, value]) =>
                        <FormInputs
                          key={item}
                          register={register}
                          setValue={setValue}
                          configuration={value}
                          value={formData[item]}
                        />
                      )}
                  </Grid.Column>
                )}
              </Grid.Row>
            </Fragment>
          )}
        </Grid>
        <Divider hidden />
        <Grid columns='equal'>
          <Grid.Column>
            <Button
              size='large'
              type='button'
              onClick={() => downloadJson()}
              style={{ backgroundColor: SSB_COLORS.PURPLE }}
            >
              <Icon name='download' style={{ paddingRight: '0.5rem' }} />
              {DOMAIN.GET_JSON[language]}
            </Button>
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Button
              size='large'
              type='submit'
              disabled={!edited || apiReadOnly}
              style={{ backgroundColor: SSB_COLORS.BLUE }}
              onClick={() => window.scrollTo({ bottom: 0, behavior: 'smooth' })}
            >
              <Icon name='save' style={{ paddingRight: '0.5rem' }} />
              {DOMAIN.SAVE[language]}
            </Button>
          </Grid.Column>
        </Grid>
      </Form>
      {edited && <Message warning content={DOMAIN.WAS_EDITED[language]} />}
    </>
  )
}

export default DomainInstancesNew

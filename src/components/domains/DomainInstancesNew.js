import React, { Fragment, useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { v4 as uuidv4 } from 'uuid'
import { useForm } from 'react-hook-form'
import { Button, Divider, Form, Grid, Header, Icon, List, Message, Segment } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext, SchemasContext, UserContext } from '../../context/AppContext'
import { API, DOMAIN_PROPERTY_GROUPING } from '../../configurations'
import { FormInputs } from '../form'
import {
  camelToTitle,
  convertSchemaToEdit,
  createEmptyDataObject,
  getDomainDescription,
  getDomainSchema
} from '../../utilities'
import { DOMAIN, DOMAINS } from '../../enums'

function DomainInstancesNew ({ domains, setReady }) {
  const { user } = useContext(UserContext)
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)
  const { ldsApi, apiReadOnly } = useContext(ApiContext)

  const [saved, setSaved] = useState(false)
  const [edited, setEdited] = useState(false)
  const [formConnections, setFormConnections] = useState(false)
  const [formData] = useState(domains.reduce((accumulator, current) => ({
    ...accumulator, [current]: createEmptyDataObject(uuidv4(), user)
  }), {}))
  const [formConfiguration] = useState(domains.reduce((accumulator, current) => ({
    ...accumulator, [current]: convertSchemaToEdit({}, getDomainSchema(current, schemas), current)
  }), {}))

  const [{ loading, error, response }, executePut] =
    useAxios({ url: `${ldsApi}${API.PUT_DOMAIN_INSTANCES_DATA}`, method: 'PUT' }, { manual: true })

  const { register, handleSubmit, getValues, setValue, formState } = useForm()

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

  const createSubmittableBatch = submittedFormData => domains.map(domain => {
    const filterDomainData = Object.entries(submittedFormData[domain]).filter(value => value[1] !== undefined)
    const filteredDomainData = {}

    if (filterDomainData.length !== 0) {
      filterDomainData.forEach(value => filteredDomainData[value[0]] = value[1])
    }

    return ({
      operation: 'put',
      type: domain,
      entries: [{
        id: formData[domain].id,
        data: filterDomainData.length !== 0 ? { ...formData[domain], ...filteredDomainData } : formData[domain]
      }]
    })
  })

  const onSubmit = submittedFormData => {
    const submittableBatch = createSubmittableBatch(submittedFormData)

    executePut({ data: submittableBatch }).then()
  }

  const downloadJson = () => {
    const json = createSubmittableBatch(getValues())
    const filename = `${domains.join('_')}.json`
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'text/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    if (!loading && !error && response !== undefined) {
      if (response.status === 201 || response.status === 200) {
        setSaved(true)
        setEdited(false)
      }
    }
  }, [loading, error, response])

  return (
    <>
      <Grid columns='equal'>
        <Grid.Row>
          <Grid.Column textAlign='right'>
            <Icon
              link
              size='big'
              loading={loading}
              disabled={loading}
              name='undo alternate'
              onClick={() => setReady(false)}
              style={{ color: SSB_COLORS.BLUE }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {formConnections &&
            <Segment>
              <Header size='small' content={DOMAINS.LINKS[language]} />
              {Object.entries(formConnections).length === 0 ? DOMAINS.NO_CONNECTIONS[language] :
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
              }
            </Segment>
            }
          </Grid.Column>
          <Grid.Column>
            {Object.entries(formConnections).length !== 0 &&
            <Segment>
              <i>TODO: Muligheter her for å velge hvilke av de man lager her man vil koble til de andre man lager
                her?</i>
            </Segment>
            }
          </Grid.Column>
        </Grid.Row>
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
              loading={loading}
              disabled={loading || !edited || apiReadOnly}
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
      {error && <ErrorMessage error={error} language={language} />}
      {saved &&
      <Message icon success>
        <Icon name='check' style={{ color: SSB_COLORS.GREEN }} />
        <Message.Content>
          <Message.Header>
            {DOMAIN.SUCCESS[language]}
          </Message.Header>
          {DOMAIN.WAS_SAVED_MULTI[language]}
        </Message.Content>
      </Message>
      }
    </>
  )
}

export default DomainInstancesNew

import React, { Fragment, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom'
import { Button, Container, Divider, Form, Grid, Header, Icon, Message } from 'semantic-ui-react'
import { ErrorMessage, InfoPopup, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { FormInputs } from '../form'
import {
  camelToTitle,
  convertAutofilledToView,
  convertSchemaToEdit,
  createEmptyDataObject,
  getDomainSchema
} from '../../utilities'
import { DOMAIN } from '../../enums'
import { API, DOMAIN_PROPERTY_GROUPING } from '../../configurations'

function DomainInstanceNew ({ language, ldsApi, schemas }) {
  const { domain } = useParams()

  const [id] = useState(uuidv4())
  const [saved, setSaved] = useState(false)
  const [schema] = useState(getDomainSchema(domain, schemas))
  const [data, setData] = useState(createEmptyDataObject(schema, id))
  const [formConfiguration] = useState(convertSchemaToEdit({}, schema))

  const [{ loading, error, response }, executePut] =
    useAxios({ url: `${ldsApi}${API.PUT_DOMAIN_INSTANCE_DATA(domain, id)}`, method: 'PUT' }, { manual: true })

  useEffect(() => {
    if (!loading && !error && response !== undefined) {
      if (response.status === 201) {
        setSaved(true)
      }
    }
  }, [loading, error, response])

  return (
    <>
      <Header size='large' content={camelToTitle(domain)} subheader={id} />
      {error && <ErrorMessage error={error} language={language} />}
      {saved &&
      <Message
        success
        header={DOMAIN.SUCCESS[language]}
        content={DOMAIN.WAS_SAVED[language]}
        icon={{ name: 'check', style: { color: SSB_COLORS.GREEN } }}
      />
      }
      <Grid divided>
        {DOMAIN_PROPERTY_GROUPING.filter(group => group.name !== 'AUTOFILLED').map(({ name, test }) =>
          <Grid.Column key={name} width={6}>
            <Form size='large'>
              {Object.entries(formConfiguration).filter(([item]) => test(item)).map(([item, value]) =>
                <FormInputs key={item} configuration={value} />
              )}
            </Form>
          </Grid.Column>
        )}
        {DOMAIN_PROPERTY_GROUPING.filter(group => group.name === 'AUTOFILLED').map(({ name, test }) =>
          <Grid.Column key={name} width={4}>
            {Object.entries(formConfiguration).filter(([item]) => test(item)).map(([item, value]) => {
                return (
                  <Fragment key={item}>
                    <InfoPopup text={value.description}
                               trigger={<Header size='small'>{camelToTitle(value.name)}</Header>} />
                    {convertAutofilledToView(item, data[item])}
                  </Fragment>
                )
              }
            )}
          </Grid.Column>
        )}
      </Grid>
      <Divider hidden />
      <Container fluid textAlign='right'>
        <Button
          size='large'
          disabled={loading}
          style={{ backgroundColor: SSB_COLORS.BLUE }}
          onClick={() => console.log('Saving!')}
        >
          <Icon name='save' style={{ paddingRight: '0.5rem' }} />
          {DOMAIN.SAVE[language]}
        </Button>
      </Container>
    </>
  )
}

export default DomainInstanceNew

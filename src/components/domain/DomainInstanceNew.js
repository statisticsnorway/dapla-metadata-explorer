import React, { Fragment, useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button, Divider, Form, Grid, Header, Icon, Message } from 'semantic-ui-react'
import { ErrorMessage, InfoPopup, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { FormInputs } from '../form'
import { ApiContext, LanguageContext, SchemasContext, UserContext } from '../../context/AppContext'
import {
  camelToTitle,
  convertAutofilledToView,
  convertSchemaToEdit,
  createEmptyDataObject,
  getDomainDescription,
  getDomainSchema
} from '../../utilities'
import { API, DOMAIN_PROPERTY_GROUPING } from '../../configurations'
import { DOMAIN } from '../../enums'

function DomainInstanceNew () {
  const { user } = useContext(UserContext)
  const { ldsApi } = useContext(ApiContext)
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)

  const { domain } = useParams()

  const [id] = useState(uuidv4())
  const [saved, setSaved] = useState(false)
  const [edited, setEdited] = useState(false)
  const [schema] = useState(getDomainSchema(domain, schemas))
  const [formData] = useState(createEmptyDataObject(id, user))
  const [formConfiguration] = useState(convertSchemaToEdit({}, schema))

  const { register, handleSubmit, setValue, formState, getValues } = useForm()

  useEffect(() => {
    if (formState.isDirty) {
      setEdited(true)
    }
  }, [formState.isDirty])

  const onSubmit = data => {
    const filterData = Object.entries(data).filter(value => value[1] !== undefined)

    if (filterData.length !== 0) {
      const filteredData = {}

      filterData.forEach(value => filteredData[value[0]] = value[1])

      executePut({ data: { ...formData, ...filteredData } })
    } else {
      executePut({ data: formData })
    }
  }

  const [{ loading, error, response }, executePut] =
    useAxios({ url: `${ldsApi}${API.PUT_DOMAIN_INSTANCE_DATA(domain, id)}`, method: 'PUT' }, { manual: true })

  useEffect(() => {
    if (!loading && !error && response !== undefined) {
      if (response.status === 201) {
        setSaved(true)
      }
    }
  }, [loading, error, response])

  const downloadJson = () => {
    let json
    const filterData = Object.entries(getValues()).filter(value => value[1] !== undefined)

    if (filterData.length !== 0) {
      const filteredData = {}

      filterData.forEach(value => filteredData[value[0]] = value[1])

      json = { ...formData, ...filteredData }
    } else {
      json = formData
    }

    const filename = `${domain}_${id}.json`
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

  return (
    <>
      <Header
        size='large'
        subheader={getDomainDescription(schema)}
        content={`${DOMAIN.CREATE_NEW[language]} '${camelToTitle(domain)}'`}
      />
      {edited && <Message warning content={DOMAIN.WAS_EDITED[language]} />}
      {error && <ErrorMessage error={error} language={language} />}
      {saved &&
      <Message
        success
        header={DOMAIN.SUCCESS[language]}
        content={DOMAIN.WAS_SAVED[language]}
        icon={{ name: 'check', style: { color: SSB_COLORS.GREEN } }}
      />
      }
      <Divider hidden />
      <Form size='large' onSubmit={handleSubmit(onSubmit)}>
        <Grid divided>
          {DOMAIN_PROPERTY_GROUPING.filter(group => group.name !== 'AUTOFILLED').map(({ name, test }) =>
            <Grid.Column key={name} width={6}>

              {Object.entries(formConfiguration).filter(([item]) => test(item)).map(([item, value]) =>
                <FormInputs key={item} configuration={value} register={register} setValue={setValue} />
              )}
            </Grid.Column>
          )}
          {DOMAIN_PROPERTY_GROUPING.filter(group => group.name === 'AUTOFILLED').map(({ name, test }) =>
            <Grid.Column key={name} width={4}>
              {Object.entries(formConfiguration).filter(([item]) => test(item)).map(([item, value]) => {
                  return (
                    <Fragment key={item}>
                      <InfoPopup text={value.description}
                                 trigger={<Header size='small'>{camelToTitle(value.name)}</Header>} />
                      {convertAutofilledToView(item, formData[item])}
                    </Fragment>
                  )
                }
              )}
            </Grid.Column>
          )}
        </Grid>
        <Divider hidden />
        <Grid columns='equal'>
          <Grid.Column textAlign='left'>
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
              disabled={loading}
              style={{ backgroundColor: SSB_COLORS.BLUE }}
            >
              <Icon name='save' style={{ paddingRight: '0.5rem' }} />
              {DOMAIN.SAVE[language]}
            </Button>
          </Grid.Column>
        </Grid>
      </Form>
    </>
  )
}

export default DomainInstanceNew

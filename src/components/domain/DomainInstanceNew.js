import React, { Fragment, useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { v4 as uuidv4 } from 'uuid'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button, Divider, Form, Grid, Header, Icon, Message } from 'semantic-ui-react'
import { ErrorMessage, InfoPopup, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { FormHelp, FormInputs } from '../form'
import { ApiContext, LanguageContext, SchemasContext, UserContext } from '../../context/AppContext'
import {
  camelToTitle,
  convertAutofilledToView,
  convertSchemaToEdit,
  createEmptyDataObject,
  getDomainDescription,
  getDomainSchema,
  updateDataObject
} from '../../utilities'
import { API, DOMAIN_PROPERTY_GROUPING, ROUTING } from '../../configurations'
import { DOMAIN, FORM } from '../../enums'

function DomainInstanceNew ({ isNew = true, data = {}, refetch = () => null }) {
  const { user } = useContext(UserContext)
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)
  const { ldsApi, apiReadOnly } = useContext(ApiContext)

  const { domain } = useParams()

  const [saved, setSaved] = useState(false)
  const [edited, setEdited] = useState(false)
  const [id] = useState(isNew ? uuidv4() : data.id)
  const [schema] = useState(getDomainSchema(domain, schemas))
  const [formHelpOpen, setFormHelpOpen] = useState(false)
  const [formConfiguration] = useState(convertSchemaToEdit({}, schema))
  const [formData] = useState(isNew ? createEmptyDataObject(id, user) : updateDataObject(data, user))

  const { register, handleSubmit, setValue, formState, getValues } = useForm()

  useEffect(() => {
    if (formState.isDirty) {
      setEdited(true)
    }
  }, [formState.isDirty])

  const onSubmit = submittedFormData => {
    if (!apiReadOnly) {
      const filterData = Object.entries(submittedFormData).filter(value => value[1] !== undefined)
      const refetchIfNotNew = () => {
        if (!isNew) {
          refetch()
        }
      }

      if (filterData.length !== 0) {
        const filteredData = {}

        filterData.forEach(value => filteredData[value[0]] = value[1])

        executePut({ data: { ...formData, ...filteredData } }).then(() => refetchIfNotNew())
      } else {
        executePut({ data: formData }).then(() => refetchIfNotNew())
      }
    }
  }

  const [{ loading, error, response }, executePut] =
    useAxios({ url: `${ldsApi}${API.PUT_DOMAIN_INSTANCE_DATA(domain, id)}`, method: 'PUT' }, { manual: true })

  useEffect(() => {
    if (!loading && !error && response !== undefined) {
      if (response.status === 201) {
        setSaved(true)
        setEdited(false)
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
      <Grid columns='equal' style={{ marginBottom: '2rem' }}>
        <Grid.Column>
          <Header
            size='large'
            subheader={getDomainDescription(schema)}
            icon={{ name: 'edit outline', style: { color: SSB_COLORS.BLUE } }}
            content={`${isNew ? DOMAIN.CREATE_NEW[language] : DOMAIN.EDIT[language]} '${camelToTitle(domain)}'`}
          />
        </Grid.Column>
        <Grid.Column textAlign='right'>
          <Button
            basic
            content={FORM.HEADER[language]}
            onClick={() => setFormHelpOpen(true)}
            icon={{ name: 'help circle', style: { color: SSB_COLORS.BLUE } }}
          />
        </Grid.Column>
      </Grid>
      {edited && <Message warning content={DOMAIN.WAS_EDITED[language]} />}
      <Divider hidden />
      <Form size='large' onSubmit={handleSubmit(onSubmit)}>
        <Grid divided>
          {DOMAIN_PROPERTY_GROUPING.filter(group => group.id !== 'AUTOFILLED').map(({ id, test }) =>
            <Grid.Column key={id} width={6}>
              {Object.entries(formConfiguration).filter(([item]) => test(item)).map(([item, value]) =>
                <FormInputs
                  key={item}
                  register={register}
                  setValue={setValue}
                  configuration={value}
                  value={isNew ? false : formData[item]}
                />
              )}
            </Grid.Column>
          )}
          {DOMAIN_PROPERTY_GROUPING.filter(group => group.id === 'AUTOFILLED').map(({ id, test }) =>
            <Grid.Column key={id} width={4}>
              {Object.entries(formConfiguration).filter(([item]) => test(item)).map(([item, value]) => {
                  return (
                    <Fragment key={item}>
                      <InfoPopup
                        text={value.description}
                        trigger={<Header size='tiny'>{camelToTitle(value.name)}</Header>}
                      />
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
      <Divider hidden />
      {edited && <Message warning content={DOMAIN.WAS_EDITED[language]} />}
      {error && <ErrorMessage error={error} language={language} />}
      {saved &&
      <Message icon success>
        <Icon name='check' style={{ color: SSB_COLORS.GREEN }} />
        <Message.Content>
          <Message.Header>
            {DOMAIN.SUCCESS[language]}
          </Message.Header>
          {DOMAIN.WAS_SAVED[language]}
          <br />
          {isNew &&
          <>
            <Link to={`${ROUTING.DOMAIN_BASE}${domain}/${id}`}>{`${DOMAIN.JUMP_TO_SAVED[language]}`}</Link>
            <br />
          </>
          }
          <Link to={`${ROUTING.DOMAIN_BASE}${domain}`}>{
            `${DOMAIN.BACK_TO_LIST[language]} '${camelToTitle(domain)}'`}
          </Link>
        </Message.Content>
      </Message>
      }
      <FormHelp open={formHelpOpen} setOpen={setFormHelpOpen} user={user} />
    </>
  )
}

export default DomainInstanceNew

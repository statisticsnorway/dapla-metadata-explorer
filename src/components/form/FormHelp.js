import React, { useContext } from 'react'
import { Button, Divider, Form, Grid, Header, Icon, List, Message, Modal, Popup, Segment } from 'semantic-ui-react'
import { InfoText, SSB_COLORS, SSB_STYLE } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../context/AppContext'
import { DOMAIN, FORM } from '../../enums'

function FormHelp ({ open, setOpen, user }) {
  const { language } = useContext(LanguageContext)

  return (
    <Modal size='fullscreen' open={open} onClose={() => setOpen(false)} style={SSB_STYLE} centered={false}>
      <Header size='large' style={SSB_STYLE}>
        <Icon name='help circle' style={{ color: SSB_COLORS.BLUE }} />
        {FORM.HEADER[language]}
      </Header>
      <Modal.Content as={Segment} basic style={SSB_STYLE}>
        <Header size='small' content={FORM.SETUP[language]} />
        <Segment>
          <Header
            disabled
            size='medium'
            content={FORM.EXAMPLE_HEADER[language]}
            subheader={FORM.EXAMPLE_SUBHEADER[language]}
            icon={{ name: 'pencil', style: { color: SSB_COLORS.BLUE } }}
          />
          <Message style={{ opacity: '0.45' }} size='small' info content={FORM.EXAMPLE_MESSAGE[language]} />
          <Divider hidden style={{ marginBottom: '2rem' }} />
          <Form>
            <Grid divided>
              <Grid.Column verticalAlign='middle' width={6}>
                <Header size='tiny' disabled content={FORM.COLUMN_COMMON[language]} />
                <Divider hidden />
                <Form.Field disabled>
                  <Form.Input placeholder={FORM.EXAMPLE[language]} label={FORM.EXAMPLE[language]} />
                </Form.Field>
              </Grid.Column>
              <Grid.Column verticalAlign='middle' width={6}>
                <Header size='tiny' disabled content={FORM.COLUMN_UNIQUE[language]} />
                <Divider hidden />
                <Form.Field disabled>
                  <Form.Input required placeholder={FORM.EXAMPLE[language]} label={FORM.EXAMPLE[language]} />
                </Form.Field>
              </Grid.Column>
              <Grid.Column verticalAlign='middle' width={4}>
                <Header size='tiny' disabled content={FORM.COLUMN_AUTOFILLED[language]} />
                <Divider hidden />
                <Header disabled size='small'>{FORM.EXAMPLE_AUTOFILLED[language]}</Header>
                <Icon disabled size='large' name='user' style={{ color: SSB_COLORS.BLUE }} />
                <span style={{ opacity: '0.45' }}>{user}</span>
              </Grid.Column>
            </Grid>
          </Form>
          <Divider hidden />
          <Grid columns='equal'>
            <Grid.Column>
              <Button
                disabled
                size='small'
                style={{ backgroundColor: SSB_COLORS.PURPLE }}
              >
                <Icon name='download' style={{ paddingRight: '0.5rem' }} />
                {DOMAIN.GET_JSON[language]}
              </Button>
              <br />
              <InfoText text={FORM.BUTTON_JSON[language]} />
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Button
                disabled
                size='small'
                style={{ backgroundColor: SSB_COLORS.BLUE }}
              >
                <Icon name='save' style={{ paddingRight: '0.5rem' }} />
                {DOMAIN.SAVE[language]}
              </Button>
              <br />
              <InfoText text={FORM.BUTTON_SAVE[language]} />
            </Grid.Column>
          </Grid>
          <Message style={{ opacity: '0.45' }} size='small' info content={FORM.EXAMPLE_MESSAGE[language]} />
        </Segment>
        <Header size='small' content={FORM.OTHER_INFO[language]} />
        <List relaxed='very' bulleted>
          <List.Item>
            <span style={{ color: '#db2828' }}>*</span>
            {` ${FORM.REQUIRED[language]}`}
          </List.Item>
          <List.Item>
            {FORM.POPUP[language]}
            <Popup basic flowing trigger={<b>{` ${FORM.TRY_THIS[language]}`}</b>}>
              <InfoText text={FORM.EXAMPLE_DESCRIPTION[language]} />
            </Popup>
          </List.Item>
        </List>
      </Modal.Content>
    </Modal>
  )
}

export default FormHelp

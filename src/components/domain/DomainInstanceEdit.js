import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Divider, Icon, Transition } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { DomainInstanceNew } from './'
import { LanguageContext } from '../../context/AppContext'
import { DOMAIN } from '../../enums'

function DomainInstanceEdit ({ data, refetch }) {
  const { language } = useContext(LanguageContext)

  const [editOpen, setEditOpen] = useState(false)
  const [triggerAnimation, setTriggerAnimation] = useState(false)

  useEffect(() => {
    if (editOpen) {
      setTriggerAnimation(true)
    } else {
      setTriggerAnimation(false)
    }
  }, [editOpen])

  return (
    <>
      <Container fluid textAlign='right'>
        <Button
          size='large'
          onClick={() => setEditOpen(!editOpen)}
          style={{ backgroundColor: SSB_COLORS.YELLOW }}
        >
          <Icon name='pencil alternate' style={{ paddingRight: '0.5rem' }} />
          {DOMAIN.EDIT[language]}
        </Button>
      </Container>
      {editOpen &&
      <>
        <Divider hidden />
        <Container textAlign='center'>
          <Transition
            duration={1500}
            animation='bounce'
            visible={triggerAnimation}
          >
            <Icon name='arrow down' size='huge' style={{ color: SSB_COLORS.BLUE }} />
          </Transition>
        </Container>
        <Divider hidden />
        <DomainInstanceNew isNew={false} data={data} refetch={refetch} />
      </>
      }
    </>
  )
}

export default DomainInstanceEdit

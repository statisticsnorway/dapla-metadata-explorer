import React, { useContext, useState } from 'react'
import { Button, Container, Divider, Icon } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { DomainInstanceNew } from './'
import { LanguageContext } from '../../context/AppContext'
import { DOMAIN } from '../../enums'

function DomainInstanceEdit ({ data, refetch }) {
  const { language } = useContext(LanguageContext)

  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <Container fluid textAlign='right'>
        <Button
          size='large'
          style={{ backgroundColor: SSB_COLORS.YELLOW }}
          onClick={() => setEditOpen(!editOpen)}
        >
          <Icon name='pencil alternate' style={{ paddingRight: '0.5rem' }} />
          {DOMAIN.EDIT[language]}
        </Button>
      </Container>
      {editOpen &&
      <>
        <Divider />
        <DomainInstanceNew isNew={false} data={data} refetch={refetch} />
      </>
      }
    </>
  )
}

export default DomainInstanceEdit

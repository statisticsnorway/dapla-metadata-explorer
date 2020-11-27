import React, { useContext, useState } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { getLocalizedGsimObjectText, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../context/AppContext'
import { GSIM } from '../../configurations'
import { DOMAIN, UI } from '../../enums'

function DomainInstanceGraph ({ domain, data }) {
  const { language } = useContext(LanguageContext)

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Modal
      closeIcon
      centered={false}
      open={modalOpen}
      size='fullscreen'
      onOpen={() => setModalOpen(true)}
      onClose={() => setModalOpen(false)}
      trigger={
        <Button size='large' style={{ backgroundColor: SSB_COLORS.BLUE }}>
          <Icon name='share alternate' style={{ paddingRight: '0.5rem' }} />
          {DOMAIN.CONNECTIONS[language]}
        </Button>
      }
    >
      <Modal.Header>
        <Header
          content={`${DOMAIN.CONNECTIONS_HEADER[language]} '${getLocalizedGsimObjectText(language, data[GSIM.NAME])}'`}
          icon={{ name: 'share alternate', style: { color: SSB_COLORS.BLUE } }}
          subheader={domain}
        />
      </Modal.Header>
      <Modal.Content>
        {UI.UNKOWN}
      </Modal.Content>
    </Modal>
  )
}

export default DomainInstanceGraph

import React, { useContext, useMemo, useState } from 'react'
import { Graph } from 'react-d3-graph'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { getNestedObject, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext, SchemasContext } from '../../context/AppContext'
import { camelToTitle, getDomainDescription, getDomainRef } from '../../utilities'
import { API, GRAPH_CONFIG, GSIM } from '../../configurations'
import { UI } from '../../enums'

const isReadOnlyAPI = api => api ? API.LDS[0] : API.LDS[1]

function DomainsGraph () {
  const { ldsApi } = useContext(ApiContext)
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [dependencyGraph, setDependencyGraph] = useState(false)
  const [graphConfig] = useState(GRAPH_CONFIG((window.screen.width / 0.6022), (window.screen.height / 0.815)))

  useMemo(() => {
    if (modalOpen) {
      let links = []
      let flatSchemas = []

      Object.entries(schemas.groups).forEach(([key, value]) => {
        if (value.length !== 0) {
          flatSchemas = flatSchemas.concat(value)
        }
      })

      flatSchemas.forEach(schema => {
        const domainName = getDomainRef(schema)
        const domainProperties = getNestedObject(schema, GSIM.PROPERTIES(schema))

        Object.entries(domainProperties).forEach(([key, property]) => {
          if (key.startsWith(GSIM.LINK_TYPE)) {
            Object.keys(property.properties).forEach(linkKey => {
              if (domainName === linkKey) {
                links.push({
                  source: domainName,
                  target: linkKey,
                  strokeWidth: 1.5,
                  opacity: 0.5
                })
              } else {
                links.push({
                  source: domainName,
                  target: linkKey
                })
              }
            })
          }
        })
      })

      const dependencyGraph = {
        nodes: flatSchemas.map(schema => {
          const domainName = getDomainRef(schema)
          const domainDescription = getDomainDescription(schema)

          return { id: domainName, nodeLabelName: camelToTitle(domainName), nodeLabelDescription: domainDescription }
        }),
        links: links
      }

      setDependencyGraph(dependencyGraph)
    }
  }, [modalOpen, schemas.groups])

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
          {UI.CONNECTIONS[language]}
        </Button>
      }
    >
      <Modal.Header>
        <Header
          content={`${UI.CONNECTIONS_HEADER[language]}`}
          icon={{ name: 'share alternate', style: { color: SSB_COLORS.BLUE } }}
          subheader={isReadOnlyAPI(window._env.REACT_APP_EXPLORATION_LDS === ldsApi)}
        />
      </Modal.Header>
      <Modal.Content>
        {dependencyGraph && <Graph id='graph-id' config={graphConfig} data={dependencyGraph} />}
      </Modal.Content>
    </Modal>
  )
}

export default DomainsGraph

import React, { useContext, useEffect, useState } from 'react'
import { useManualQuery } from 'graphql-hooks'
import { Graph } from 'react-d3-graph'
import { Button, Divider, Grid, Header, Icon, List, Loader, Modal, Segment } from 'semantic-ui-react'
import { ErrorMessage, getLocalizedGsimObjectText, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../context/AppContext'
import { capitalize, deCapitalize } from '../../utilities'
import { GRAPH_CONFIG, GSIM } from '../../configurations'
import { extendedConnectionsQueries, queriesShouldIgnore } from '../../queries'
import { DOMAIN } from '../../enums'

function DomainInstanceExtendedGraph ({ domain, instanceData }) {
  const { language } = useContext(LanguageContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [hoveredNode, setHoveredNode] = useState(false)
  const [dependencyGraph, setDependencyGraph] = useState(false)
  const [queryHasBeenRun, setQueryHasBeenRun] = useState(false)
  const [graphConfig] = useState(GRAPH_CONFIG(window.screen.width, window.screen.height))
  const [query] = useState(
    extendedConnectionsQueries[deCapitalize(domain)] !== undefined ?
      extendedConnectionsQueries[deCapitalize(domain)] : ''
  )

  const [executeQuery, { loading, error, data }] = useManualQuery(query, {
    variables: {
      id: instanceData.id
    }
  })

  useEffect(() => {
    if (!loading && !error && data !== undefined && queryHasBeenRun) {
      const dependencyGraph = {
        nodes: [
          {
            size: 800,
            linkTo: false,
            id: instanceData[GSIM.ID],
            nodeLabelName: `${getLocalizedGsimObjectText(language, instanceData[GSIM.NAME])} (${domain})`,
            nodeLabelDescription: getLocalizedGsimObjectText(language, instanceData[GSIM.PROPERTY_DESCRIPTION]),
          }
        ],
        links: []
      }

      const fixNodes = (fromData, linkTo, fromId) => {
        if (Array.isArray(fromData)) {
          fromData.forEach(domain => {
            fixNodes(domain, linkTo, fromId)
          })
        } else {
          Object.entries(fromData).forEach(([domain, domainData]) => {
            if (domainData !== null) {
              if (!queriesShouldIgnore.includes(domain)) {
                if (!Array.isArray(domainData)) {
                  dependencyGraph.nodes.push({
                    size: 200,
                    linkTo: linkTo,
                    id: domainData[GSIM.ID],
                    nodeLabelName: `${getLocalizedGsimObjectText(language, domainData[GSIM.NAME])} (${capitalize(domain)})`,
                    nodeLabelDescription: getLocalizedGsimObjectText(language, domainData[GSIM.PROPERTY_DESCRIPTION])
                  })

                  dependencyGraph.links.push({
                    source: fromId,
                    target: domainData[GSIM.ID],
                    linkLabelName: DOMAIN.USES[language]
                  })
                } else {
                  domainData.forEach(domainData => {
                    dependencyGraph.nodes.push({
                      size: 200,
                      linkTo: linkTo,
                      id: domainData[GSIM.ID],
                      nodeLabelName: `${getLocalizedGsimObjectText(language, domainData[GSIM.NAME])} (${capitalize(domain)})`,
                      nodeLabelDescription: getLocalizedGsimObjectText(language, domainData[GSIM.PROPERTY_DESCRIPTION])
                    })

                    const isReverse = domain.toLowerCase().startsWith('reverse')

                    dependencyGraph.links.push({
                      source: isReverse ? domainData[GSIM.ID] : fromId,
                      target: isReverse ? fromId : domainData[GSIM.ID],
                      linkLabelName: isReverse ? DOMAIN.USED_BY[language] : DOMAIN.USES[language]
                    })
                  })
                }

                if (Object.keys(domainData).filter(key => !queriesShouldIgnore.includes(key)).length !== 0) {
                  fixNodes(domainData, false, domainData[GSIM.ID])
                }
              }
            }
          })
        }
      }

      fixNodes(data[0][deCapitalize(domain)], true, instanceData[GSIM.ID])

      setDependencyGraph(dependencyGraph)
    }
  }, [loading, error, data, domain, instanceData, language, queryHasBeenRun])

  const onMouseOverNode = nodeId => setHoveredNode(dependencyGraph.nodes.filter(node => node.id === nodeId)[0])
  const onMouseOutNode = () => setHoveredNode(false)

  return (
    <Modal
      closeIcon
      centered={false}
      open={modalOpen}
      size='fullscreen'
      onOpen={() => {
        if (query !== '') {
          executeQuery()
        }
        setModalOpen(true)
        setQueryHasBeenRun(true)
      }}
      onClose={() => {
        setModalOpen(false)
        setQueryHasBeenRun(false)
      }}
      trigger={
        <Button size='large' style={{ backgroundColor: SSB_COLORS.BLUE }} disabled={query === ''}>
          <Icon name='code branch' style={{ paddingRight: '0.5rem' }} />
          {DOMAIN.EXTENDED_CONNECTIONS[language]}
        </Button>
      }
    >
      <Modal.Header>
        <Header
          subheader={domain}
          icon={{ name: 'code branch', style: { color: SSB_COLORS.BLUE } }}
          content={`${DOMAIN.EXTENDED_CONNECTIONS_HEADER[language]} '${getLocalizedGsimObjectText(language, instanceData[GSIM.NAME])}'`}
        />
      </Modal.Header>
      <Modal.Content scrolling>
        {loading && <Segment basic><Loader active inline='centered' /></Segment>}
        {error && <ErrorMessage error={error} language={language} />}
        {dependencyGraph &&
        <Grid>
          <Grid.Column width={10}>
            <Segment>
              <Graph
                id='graph-id'
                config={graphConfig}
                data={dependencyGraph}
                onMouseOutNode={onMouseOutNode}
                onMouseOverNode={onMouseOverNode}
              />
            </Segment>
          </Grid.Column>
          <Grid.Column width={6}>
            <Grid columns='equal'>
              <Grid.Row>
                <Grid.Column>
                  <Header size='small'
                          content={`${getLocalizedGsimObjectText(language, instanceData[GSIM.NAME])} (${domain})`} />
                  <List relaxed>
                    <List.Item
                      header='Id'
                      description={instanceData[GSIM.ID]}
                    />
                    <List.Item
                      header='Description'
                      description={getLocalizedGsimObjectText(language, instanceData[GSIM.PROPERTY_DESCRIPTION])}
                    />
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header size='small' content={DOMAIN.USES_DIRECT[language]} />
                  <List bulleted>
                    {dependencyGraph.nodes.filter(filterableNode => filterableNode.linkTo === true).map(node =>
                      <List.Item key={node.id}
                                 style={{ fontWeight: hoveredNode.id === node.id ? 'bold' : 'normal' }}>
                        {dependencyGraph.nodes.filter(filterableNode => filterableNode.id === node.id)[0].nodeLabelName}
                      </List.Item>
                    )}
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header size='small' content={DOMAIN.USES_INDIRECT[language]} />
                  <List bulleted>
                    {dependencyGraph.nodes.filter(filterableNode => filterableNode.linkTo === false && filterableNode.size !== 800).map(node =>
                      <List.Item key={node.id}
                                 style={{ fontWeight: hoveredNode.id === node.id ? 'bold' : 'normal' }}>
                        {dependencyGraph.nodes.filter(filterableNode => filterableNode.id === node.id)[0].nodeLabelName}
                      </List.Item>
                    )}
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider hidden />
            {hoveredNode &&
            <Segment raised>
              <List relaxed>
                <List.Item
                  header='Id'
                  description={hoveredNode.id}
                />
                <List.Item
                  header='Name'
                  description={hoveredNode.nodeLabelName}
                />
                <List.Item
                  header='Description'
                  description={hoveredNode.nodeLabelDescription}
                />
              </List>
            </Segment>
            }
          </Grid.Column>
        </Grid>
        }
      </Modal.Content>
    </Modal>
  )
}

export default DomainInstanceExtendedGraph

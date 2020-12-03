import React, { useContext, useEffect, useState } from 'react'
import { useManualQuery } from 'graphql-hooks'
import { Graph } from 'react-d3-graph'
import { Button, Divider, Grid, Header, Icon, List, Loader, Modal, Segment } from 'semantic-ui-react'
import {
  ErrorMessage,
  getLocalizedGsimObjectText,
  getNestedObject,
  SSB_COLORS
} from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext, SchemasContext } from '../../context/AppContext'
import { camelToTitle, deCapitalize, getDomainRef } from '../../utilities'
import { GRAPH_CONFIG, GSIM } from '../../configurations'
import { query } from '../../queries'
import { DOMAIN } from '../../enums'

function DomainInstanceGraph ({ domain, instanceData, schema }) {
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [hoveredNode, setHoveredNode] = useState(false)
  const [dependencyGraph, setDependencyGraph] = useState(false)
  const [builtQuery, setBuiltQuery] = useState(query(deCapitalize(domain)))
  const [graphConfig] = useState(GRAPH_CONFIG(window.screen.width, window.screen.height))

  const [executeQuery, { loading, error, data }] = useManualQuery(builtQuery, {
    variables: {
      id: instanceData.id
    }
  })

  useEffect(() => {
    const schemaProperties = getNestedObject(schema, [GSIM.DEFINITIONS, getDomainRef(schema), GSIM.PROPERTIES_ELEMENT])
    const linkProperties = Object.keys(schemaProperties).filter(propertyKey => propertyKey.startsWith(GSIM.LINK_TYPE))
    const reverseLinkProperties = Object.entries(schemas.groups).reduce((acc, [curKey, curValue]) => {
      if (curValue.length !== 0) {
        curValue.forEach(curDomain => {
          const curDomainProperties = getNestedObject(curDomain, GSIM.PROPERTIES(curDomain))

          const domainLinks = Object.entries(curDomainProperties)
            .filter(([curDomainPropertyKey]) => curDomainPropertyKey.startsWith(GSIM.LINK_TYPE))
            .filter(curDomainProperty => Object.keys(curDomainProperty[1].properties).includes(domain))

          if (domainLinks.length !== 0) {
            domainLinks.forEach(([domainLink]) =>
              acc.push([
                getDomainRef(curDomain),
                domainLink.replace(GSIM.LINK_TYPE, '')
              ])
            )
          }
        })
      }

      return acc
    }, [])

    if (linkProperties.length !== 0) {
      const linkPropertiesParsed = linkProperties.map(linkProperty => linkProperty.replace(GSIM.LINK_TYPE, ''))

      if (reverseLinkProperties.length !== 0) {
        console.log(query(deCapitalize(domain), linkPropertiesParsed, reverseLinkProperties))
        setBuiltQuery(query(deCapitalize(domain), linkPropertiesParsed, reverseLinkProperties))
      } else {
        console.log(query(deCapitalize(domain), linkPropertiesParsed))
        setBuiltQuery(query(deCapitalize(domain), linkPropertiesParsed))
      }
    }
  }, [domain, instanceData, schema, schemas.groups])

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      const dependencyGraph = {
        nodes: [
          {
            size: 800,
            id: instanceData[GSIM.ID],
            nodeLabelName: `${getLocalizedGsimObjectText(language, instanceData[GSIM.NAME])} (${domain})`,
            nodeLabelDescription: getLocalizedGsimObjectText(language, instanceData[GSIM.PROPERTY_DESCRIPTION]),
          }
        ],
        links: []
      }

      console.log(data)

      if (Array.isArray(data) && data.length !== 0) {
        Object.entries(data[0][deCapitalize(domain)]).forEach(entry => {
          if (Array.isArray(entry[1]) && entry[1].length !== 0) {
            entry[1].forEach(innerEntry => {
              let from = camelToTitle(entry[0])

              if (entry[0].startsWith('reverse')) {
                const fixFrom = from.split(' ').filter(stringElement => stringElement !== 'Reverse' && stringElement !== domain).join(' ')

                from = fixFrom.charAt(0).toUpperCase() + fixFrom.slice(1)

                dependencyGraph.links.push({
                  linkTo: false,
                  source: instanceData[GSIM.ID],
                  target: innerEntry[GSIM.ID],
                  linkLabelName: DOMAIN.USED_BY[language]
                })
              } else {
                dependencyGraph.links.push({
                  linkTo: true,
                  source: innerEntry[GSIM.ID],
                  target: instanceData[GSIM.ID],
                  linkLabelName: DOMAIN.USES[language]
                })
              }

              dependencyGraph.nodes.push({
                size: 400,
                id: innerEntry[GSIM.ID],
                nodeLabelName: `${getLocalizedGsimObjectText(language, innerEntry[GSIM.NAME])} (${from})`,
                nodeLabelDescription: getLocalizedGsimObjectText(language, innerEntry[GSIM.PROPERTY_DESCRIPTION]),
              })
            })
          } else {
            if (!Array.isArray(entry[1]) && entry[1] !== null && typeof entry[1] === 'object') {
              let from = camelToTitle(entry[0])

              if (entry[0].startsWith('reverse')) {
                const fixFrom = from.split(' ').filter(stringElement => stringElement !== 'Reverse' && stringElement !== domain).join(' ')

                from = fixFrom.charAt(0).toUpperCase() + fixFrom.slice(1)

                dependencyGraph.links.push({
                  linkTo: false,
                  source: instanceData[GSIM.ID],
                  target: entry[1][GSIM.ID],
                  linkLabelName: DOMAIN.USED_BY[language]
                })
              } else {
                dependencyGraph.links.push({
                  linkTo: true,
                  source: entry[1][GSIM.ID],
                  target: instanceData[GSIM.ID],
                  linkLabelName: DOMAIN.USES[language]
                })
              }

              dependencyGraph.nodes.push({
                size: 600,
                id: entry[1][GSIM.ID],
                nodeLabelName: `${getLocalizedGsimObjectText(language, entry[1][GSIM.NAME])} (${from})`,
                nodeLabelDescription: getLocalizedGsimObjectText(language, entry[1][GSIM.PROPERTY_DESCRIPTION]),
              })
            }
          }
        })
      }

      setDependencyGraph(dependencyGraph)
      console.log(dependencyGraph)
    }
  }, [loading, error, data, domain, instanceData, language])

  const onMouseOverNode = nodeId => setHoveredNode(dependencyGraph.nodes.filter(node => node.id === nodeId)[0])
  const onMouseOutNode = () => setHoveredNode(false)

  return (
    <Modal
      closeIcon
      centered={false}
      open={modalOpen}
      size='fullscreen'
      onOpen={() => {
        executeQuery()
        setModalOpen(true)
      }}
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
          subheader={domain}
          icon={{ name: 'share alternate', style: { color: SSB_COLORS.BLUE } }}
          content={`${DOMAIN.CONNECTIONS_HEADER[language]} '${getLocalizedGsimObjectText(language, instanceData[GSIM.NAME])}'`}
        />
      </Modal.Header>
      <Modal.Content>
        {loading && <Segment basic><Loader active inline='centered' /></Segment>}
        {error && <ErrorMessage error={error} language={language} />}
        {dependencyGraph &&
        <Grid>
          <Grid.Column width={11}>
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
          <Grid.Column width={5}>
            {dependencyGraph &&
            <Grid columns='equal'>
              <Grid.Column>
                <Header size='small' content={DOMAIN.USED_BY[language]} />
                <List relaxed='very' bulleted>
                  {dependencyGraph.links.filter(filterableNode => filterableNode.linkTo === false).map(node =>
                    <List.Item style={{ fontWeight: hoveredNode.id === node.target ? 'bold' : 'normal' }}>
                      {dependencyGraph.nodes.filter(filterableNode => filterableNode.id === node.target)[0].nodeLabelName}
                    </List.Item>
                  )}
                </List>
              </Grid.Column>
              <Grid.Column>
                <Header size='small' content={DOMAIN.USES[language]} />
                <List relaxed='very' bulleted>
                  {dependencyGraph.links.filter(filterableNode => filterableNode.linkTo === true).map(node =>
                    <List.Item style={{ fontWeight: hoveredNode.id === node.source ? 'bold' : 'normal' }}>
                      {dependencyGraph.nodes.filter(filterableNode => filterableNode.id === node.source)[0].nodeLabelName}
                    </List.Item>
                  )}
                </List>
              </Grid.Column>
            </Grid>
            }
            <Divider hidden />
            {hoveredNode &&
            <Segment raised>
              <List relaxed='very'>
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

export default DomainInstanceGraph

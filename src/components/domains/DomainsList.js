import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Label, List, Menu, Tab } from 'semantic-ui-react'
import { getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { SchemasContext } from '../../context/AppContext'
import { getDomainDescription, getDomainDisplayName, getDomainRef } from '../../utilities'
import { GSIM, ROUTING } from '../../configurations'

function DomainsList () {
  const { schemas } = useContext(SchemasContext)

  const panes = Object.entries(schemas.groups).map(([group, schemasByGroup]) => {
    const color = getNestedObject(GSIM.GROUPS, [group.toUpperCase(), 'COLOR'])

    return {
      menuItem: (
        <Menu.Item key={group}>
          {`${group.charAt(0).toUpperCase() + group.slice(1)}`}
          <Label content={`${schemasByGroup.length}`} style={{
            backgroundColor: color,
            borderColor: color
          }}
          />
        </Menu.Item>
      ),
      render: () =>
        <List relaxed='very'>
          {schemasByGroup.map(schema =>
            <List.Item key={getDomainRef(schema)}>
              <List.Content>
                <List.Header as={Link} to={`${ROUTING.DOMAIN_BASE}${getDomainRef(schema)}`}>
                  {getDomainDisplayName(schema)}
                </List.Header>
                <List.Description>{getDomainDescription(schema)}</List.Description>
              </List.Content>
            </List.Item>
          )}
        </List>
    }
  })

  return <Tab menu={{ secondary: true, size: 'large' }} panes={panes} defaultActiveIndex={-1} />
}

export default DomainsList

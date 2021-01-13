import React, { useContext } from 'react'
import { List } from 'semantic-ui-react'

import { LanguageContext, SchemasContext } from '../../context/AppContext'

function DomainInstancesNew ({ domains }) {
  const { schemas } = useContext(SchemasContext)
  const { language } = useContext(LanguageContext)

  return (
    <>
      <List>
        {domains.map(domain =>
          <List.Item>
            {domain}
          </List.Item>
        )}
      </List>
    </>
  )
}

export default DomainInstancesNew

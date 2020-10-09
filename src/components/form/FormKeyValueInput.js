import React from 'react'
import { Form, Tab } from 'semantic-ui-react'

function FormKeyValueInput ({ configuration }) {
  const panes = configuration.configuration.options.key.values.map(value =>
    ({
      menuItem: value,
      pane: {
        key: value,
        content: (
          <Form.TextArea placeholder={configuration.configuration.options.value.name} />
        )
      }
    })
  )

  return (
    <Tab panes={panes} renderActiveOnly={false} />
  )
}

export default FormKeyValueInput

import React from 'react'

import FormInputBoolean from './FormInputBoolean'
import FormInputUnkown from './FormInputUnkown'
import { Form } from 'semantic-ui-react'
import { InfoPopup } from '@statisticsnorway/dapla-js-utilities'
import { camelToTitle } from '../../utilities'
import FormInputNumber from './FormInputNumber'
import FormInputDropdown from './FormInputDropdown'
import FormInputString from './FormInputString'
import FormKeyValueInput from './FormKeyValueInput'
import FormKeyValuesInput from './FormKeyValuesInput'
import FormInputDate from './FormInputDate'

function FormInputs ({ configuration }) {
  let input = null

  switch (configuration.configuration.inputType) {
    case 'boolean':
      input = <FormInputBoolean configuration={configuration} />
      break

    case 'number':
      input = <FormInputNumber configuration={configuration} />
      break

    case 'dropdown':
      input = <FormInputDropdown configuration={configuration} />
      break

    case 'string':
      input = <FormInputString configuration={configuration} />
      break

    case 'keyValueInput':
      input = <FormKeyValueInput configuration={configuration} />
      break

    case 'keyValuesInput':
      input = <FormKeyValuesInput configuration={configuration} />
      break

    case 'date':
      input = <FormInputDate configuration={configuration} />
      break

    default:
      input = <FormInputUnkown configuration={configuration} />
  }

  return (
    <Form.Field required={configuration.required}>
      <InfoPopup text={configuration.description} trigger={<label>{camelToTitle(configuration.name)}</label>} />
      {input}
    </Form.Field>
  )
}

export default FormInputs

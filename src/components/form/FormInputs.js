import React from 'react'
import { Form } from 'semantic-ui-react'
import { InfoPopup } from '@statisticsnorway/dapla-js-utilities'

import FormInputBoolean from './FormInputBoolean'
import FormInputUnkown from './FormInputUnkown'
import FormInputNumber from './FormInputNumber'
import FormInputDropdown from './FormInputDropdown'
import FormInputString from './FormInputString'
import FormKeyValueInput from './FormKeyValueInput'
import FormKeyValuesInput from './FormKeyValuesInput'
import FormInputDate from './FormInputDate'
import { camelToTitle } from '../../utilities'

function FormInputs ({ configuration, register, setValue, value }) {
  let input

  switch (configuration.configuration.inputType) {
    case 'boolean':
      input = <FormInputBoolean configuration={configuration} register={register} setValue={setValue} value={value} />
      break

    case 'number':
      input = <FormInputNumber configuration={configuration} register={register} setValue={setValue} value={value} />
      break

    case 'dropdown':
      input = <FormInputDropdown configuration={configuration} register={register} setValue={setValue} value={value} />
      break

    case 'string':
      input = <FormInputString configuration={configuration} register={register} setValue={setValue} value={value} />
      break

    case 'keyValueInput':
      input = <FormKeyValueInput configuration={configuration} register={register} setValue={setValue} value={value} />
      break

    case 'keyValuesInput':
      input = <FormKeyValuesInput configuration={configuration} />
      break

    case 'date':
      input = <FormInputDate configuration={configuration} register={register} setValue={setValue} value={value} />
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

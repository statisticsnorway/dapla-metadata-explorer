import React from 'react'
import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import FormInputDropdown from '../components/form/FormInputDropdown'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'

import DescribedValueDomainAllData from './test-data/DescribedValueDomainAllData.json'
import EnumeratedValueDomainAllData from './test-data/EnumeratedValueDomainAllData.json'

const { language, apiContext } = TEST_CONFIGURATIONS

const context = apiContext(window.__ENV.REACT_APP_CONCEPT_LDS, jest.fn(), jest.fn(), jest.fn(), jest.fn(), false)

const configuration = {
  register: jest.fn(),
  setValue: jest.fn(),
  configuration: {
    name: 'substantiveValueDomain',
    configuration: {
      inputType: 'dropdown',
      value: null,
      options: {
        isLink: true,
        links: ['DescribedValueDomain', 'EnumeratedValueDomain'],
        values: [],
        multiple: false
      }
    },
    required: false
  },
  value: false
}

const setup = () => {
  return render(
    <ApiContext.Provider value={context}>
      <LanguageContext.Provider value={{ language: language }}>
        <FormInputDropdown {...configuration} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )
}

test('Behaves correctly', async () => {
  const refetch = jest.fn()
    .mockResolvedValueOnce({ data: DescribedValueDomainAllData })
    .mockResolvedValueOnce({ data: EnumeratedValueDomainAllData })
  useAxios
    .mockReturnValue([{ loading: false }, refetch])
    .mockReturnValueOnce([{ loading: false }, refetch.mockResolvedValue({ data: DescribedValueDomainAllData })])
    .mockReturnValueOnce([{ loading: false }, refetch.mockResolvedValue({ data: EnumeratedValueDomainAllData })])

  setup()

  await refetch()
  await refetch()

  expect(refetch).toHaveBeenNthCalledWith(1, { url: `${context.ldsApi}/ns/${configuration.configuration.configuration.options.links[0]}` })
  expect(refetch).toHaveBeenNthCalledWith(4, { url: `${context.ldsApi}/ns/${configuration.configuration.configuration.options.links[1]}` })
})

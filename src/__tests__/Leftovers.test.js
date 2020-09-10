import { convertDataToView } from '../utilities'

import Agent from './test-data/Agent.json'
import AgentData from './test-data/AgentData.json'

import StatisticalProgramData from './test-data/StatisticalProgramData.json'
import BrokenStatisticalProgram from './test-data/BrokenStatisticalProgram.json'

test('Boolean is converted to view', () => {
  const converted = convertDataToView(AgentData[0], Agent)

  expect(converted).toHaveProperty('isExternal')
})

test('Unhandleable properties get NOT_FINISHED "tags"', () => {
  const converted = convertDataToView(StatisticalProgramData[0], BrokenStatisticalProgram)

  expect(converted.version.value).toBe('1.0.2 (...)')
  expect(converted.history.value).toBe('...')
})

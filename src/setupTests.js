import '@testing-library/jest-dom/extend-expect'

require('jest-localstorage-mock')

jest.mock('axios-hooks')
jest.mock('graphql-hooks')

window.__ENV = {
  REACT_APP_CONCEPT_LDS: process.env.REACT_APP_CONCEPT_LDS,
  REACT_APP_EXPLORATION_LDS: process.env.REACT_APP_EXPLORATION_LDS
}

global.window.scrollTo = jest.fn()

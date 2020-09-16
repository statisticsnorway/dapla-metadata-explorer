import '@testing-library/jest-dom/extend-expect'

jest.mock('react-ace')
jest.mock('axios-hooks')
jest.mock('graphql-hooks')
jest.mock('react-chartjs-2', () => ({ Pie: () => null }))

window._env = {
  REACT_APP_API: process.env.REACT_APP_API
}

import '@testing-library/jest-dom/extend-expect'

jest.mock('react-ace')
jest.mock('axios-hooks')
jest.mock('graphql-hooks')
jest.mock('react-chartjs-2', () => ({ Pie: () => null }))

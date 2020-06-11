import '@testing-library/jest-dom/extend-expect'

jest.mock('axios-hooks')
jest.mock('graphql-hooks')
jest.mock('react-chartjs-2', () => ({ Pie: () => null }))

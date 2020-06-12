import { truncateString } from '../utilities'

test('String truncation works correctly', () => {
  const longString = 'This is a story all about how a string got cut off'
  const truncatedString = truncateString(longString)

  expect(truncatedString).toBe('This is a story all about how ...')
})

test('String truncation works when provided with a non-string', () => {
  const notString = {}
  const truncatedString = truncateString(notString)

  expect(truncatedString).toBe('...')
})

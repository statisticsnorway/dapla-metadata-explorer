import { getDomainDescription } from '../utilities'
import { GSIM } from '../configurations'
import { UI } from '../enums'

const schema = {
  $ref: '#/definitions/Schema',
  definitions: {
    Schema: {
      noDescription: 'No description'
    }
  }
}

test('Handles unkown domain descriptions', () => {
  const unkownDescription = getDomainDescription(schema, GSIM.DESCRIPTION(schema))

  expect(unkownDescription).toEqual(UI.UNKOWN)
})

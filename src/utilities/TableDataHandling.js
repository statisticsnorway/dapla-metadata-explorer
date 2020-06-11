import { getNestedObject, handleBooleanForView, handleStringForView } from './'
import { GSIM, GSIM_DEFINITIONS } from '../configurations'

const NOT_FINISHED = '...'

// TODO: This needs to handle all types of definitions
const handleArrayPropertyForTable = (property, value, language) => {
  const definitionRef = getNestedObject(property, GSIM_DEFINITIONS.PATH)

  switch (definitionRef) {
    case GSIM_DEFINITIONS.MULTILINGUAL_TEXT.REFERENCE:
      return GSIM_DEFINITIONS.MULTILINGUAL_TEXT.LANGUAGE_TEXT(value, language)

    case GSIM_DEFINITIONS.ADMINISTRATIVE_DETAILS.REFERENCE:
      return NOT_FINISHED

    default:
      return NOT_FINISHED
  }
}

// TODO: This needs to handle all types and variations of types
export const mapDataToTable = (data, schema, language) => {
  const properties = getNestedObject(schema, GSIM.PROPERTIES(schema))

  return data.map(item =>
    Object.entries(item).reduce((accumulator, [property, item]) => {
      switch (properties[property][GSIM.TYPE]) {
        case 'array':
          accumulator[property] = handleArrayPropertyForTable(properties[property], item, language)
          break

        case 'boolean':
          accumulator[property] = handleBooleanForView(item)
          break

        case 'object':
          accumulator[property] = NOT_FINISHED
          break

        case 'string':
          accumulator[property] = handleStringForView(item)
          break

        default:
          accumulator[property] = NOT_FINISHED
      }

      return accumulator
    }, {})
  )
}

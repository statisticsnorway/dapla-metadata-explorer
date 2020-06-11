import { GSIM } from '../configurations'
import { UI } from '../enums'

export const getNestedObject = (nestedObject, pathArray) =>
  pathArray.reduce((object, key) =>
    (object && object[key] !== 'undefined') ? object[key] : undefined, nestedObject
  )

export const getLocalizedGsimObjectText = (language, object) => {
  if (object !== null) {
    const localized = object.find(object => object[GSIM.LOCALIZED.CODE] === language)

    return localized === undefined ? object[0][GSIM.LOCALIZED.TEXT] : localized[GSIM.LOCALIZED.TEXT]
  } else {
    return UI.UNKOWN
  }
}

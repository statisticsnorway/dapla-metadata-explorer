import { capitalize } from '../utilities'

export const query = (domain, linkPropertiesParsed = false, reverseLinkProperties = false, linkPropertiesParsedHelpers = false) => `
  {
    ${domain}(filter: {id: $id}) {
      ${!linkPropertiesParsed ? 'id' : linkPropertiesParsed.map((link, index) => {
        if (link.length === 1) {
          return `${linkPropertiesParsedHelpers[index]} {id name {languageCode languageText} description {languageCode languageText}}`
        } else {
          return `${linkPropertiesParsedHelpers[index]} { ${link.map(innerLink =>
            `... on ${capitalize(innerLink)} {id name {languageCode languageText} description {languageCode languageText}}`
          ).toString().replace(',', ' ')}}`
        }
      }).toString()}
      ${!reverseLinkProperties ? 'id' : reverseLinkProperties.map(([domainLink, link]) =>
        `reverse${domainLink}${capitalize(link)} {id name {languageCode languageText} description {languageCode languageText}}`
      ).toString()}
    }
  }
`

import { capitalize } from '../utilities'

export const query = (domain, linkPropertiesParsed = false, reverseLinkProperties = false) => `
  {
    ${domain}(filter: {id: $id}) {
      ${!linkPropertiesParsed ? 'id' : linkPropertiesParsed.map(link => `${link} {id name {languageCode languageText} description {languageCode languageText}}`).toString()}
      ${!reverseLinkProperties ? 'id' : reverseLinkProperties.map(([domainLink, link]) => `reverse${domainLink}${capitalize(link)} {id name {languageCode languageText} description {languageCode languageText}}`).toString()}
    }
  }
`

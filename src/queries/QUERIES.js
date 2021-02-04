import { capitalize } from '../utilities'

export const queriesShouldIgnore = ['id', 'name', 'description']

export const query = (domain, linkPropertiesParsed = false, reverseLinkProperties = false, linkPropertiesParsedHelpers = false) =>
`
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

export const extendedConnectionsQueries = {
  representedVariable:
    `
      {
        representedVariable(filter: {id: $id}) {
          universe {
            id
            name {
              languageCode
              languageText
            }
            description {
              languageCode
              languageText
            }
            reversePopulationUniverses {
              id
              name {
                languageCode
                languageText
              }
              description {
                languageCode
                languageText
              }
            }
          }
          substantiveValueDomain {
            ... on DescribedValueDomain {
              id
              name {
                languageCode
                languageText
              }
              description {
                languageCode
                languageText
              }
            }
            ... on EnumeratedValueDomain {
              id
              name {
                languageCode
                languageText
              }
              description {
                languageCode
                languageText
              }
            }
          }
          variable {
            id
            name {
              languageCode
              languageText
            }
            description {
              languageCode
              languageText
            }
            subjectFields {
              id
              name {
                languageCode
                languageText
              }
              description {
                languageCode
                languageText
              }
            }
            unitType {
              id
              name {
                languageCode
                languageText
              }
              description {
                languageCode
                languageText
              }
            }
          }
        }
      }
    `
}

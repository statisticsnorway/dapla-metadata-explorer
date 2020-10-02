import React, { useContext, useEffect, useState } from 'react'
import { Search } from 'semantic-ui-react'

import { LanguageContext } from '../context/AppContext'
import { getDomainDescription, getDomainRef } from '../utilities'
import { SEARCH_LAYOUT } from '../configurations'
import { UI } from '../enums'

function AppSearch ({ schemas }) {
  const { language } = useContext(LanguageContext)

  const [value, setValue] = useState('')
  const [source, setSource] = useState({})
  const [results, setResults] = useState({})

  useEffect(() => {
    setSource(Object.entries(schemas.groups).reduce((accumulator, [group, schemasByGroup]) => {
      accumulator[group] = {
        name: group.charAt(0).toUpperCase() + group.slice(1),
        results: schemasByGroup.map(schema => ({
          domain: getDomainRef(schema),
          title: getDomainRef(schema),
          description: getDomainDescription(schema)
        }))
      }

      return accumulator
    }, {}))
  }, [schemas])

  const handleSearchChange = (event, { value }) => {
    setValue(value)

    if (value.length >= 1) {
      const filteredResults = Object.entries(source).reduce((accumulator, [group, entries]) => {
        const filteredEntries = entries.results.filter(entry =>
          entry.title.toUpperCase().includes(value.toUpperCase())
        )

        if (filteredEntries.length !== 0) {
          accumulator[group] = {
            name: group.charAt(0).toUpperCase() + group.slice(1),
            results: filteredEntries
          }
        }

        return accumulator
      }, {})

      setResults(filteredResults)
    }
  }

  return (
    <Search
      category
      size='large'
      value={value}
      results={results}
      placeholder={UI.SEARCH[language]}
      onSearchChange={handleSearchChange}
      resultRenderer={SEARCH_LAYOUT.resultRenderer}
      categoryRenderer={SEARCH_LAYOUT.categoryRenderer}
      noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
      categoryLayoutRenderer={SEARCH_LAYOUT.categoryLayoutRenderer}
    />
  )
}

export default AppSearch

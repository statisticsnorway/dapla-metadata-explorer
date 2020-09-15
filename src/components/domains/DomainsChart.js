import React, { useContext } from 'react'
import { Pie } from 'react-chartjs-2'

import { SchemasContext } from '../../context/AppContext'
import { GSIM, PIE_CHART_OPTIONS } from '../../configurations'

function DomainsChart () {
  const { schemas } = useContext(SchemasContext)

  const schemasByGroup = {
    labels: Object.keys(schemas.groups).map(group => group.charAt(0).toUpperCase() + group.slice(1)),
    datasets: [{
      data: Object.entries(schemas.groups).map(group => group).reduce((accumulator, group) => {
        accumulator.push(group[1].length.toString())

        return accumulator
      }, []),
      backgroundColor: Object.keys(schemas.groups).map(group => {
        if (GSIM.GROUPS.hasOwnProperty(group.toUpperCase())) {
          return GSIM.GROUPS[group.toUpperCase()].COLOR
        } else {
          return '#999'
        }
      })
    }]
  }

  return <Pie data={schemasByGroup} options={PIE_CHART_OPTIONS} />
}

export default DomainsChart

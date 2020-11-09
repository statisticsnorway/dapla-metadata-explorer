import React from 'react'
import useAxios from 'axios-hooks'
import { List } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

function Upload ({ name, file, ldsApi }) {
  const [{ loading, error, response }] = useAxios({
    url: `${ldsApi}/ns/${file[0]}/${file[1].id}`,
    method: 'PUT',
    data: file[1]
  })

  return (
    <List.Item>
      <List.Icon
        loading={loading}
        name={loading ? 'spinner' : error ? 'times circle' : response === undefined ? 'arrow alternate circle up' : 'check'}
        style={{ color: loading ? SSB_COLORS.BLUE : error ? SSB_COLORS.RED : response === undefined ? SSB_COLORS.GREY : SSB_COLORS.GREEN }}
      />
      <List.Content>
        {name}
        <List.Description>
          {error ? error.response.data !== '' ? error.response.data : error.response.statusText : ''}
        </List.Description>
      </List.Content>
    </List.Item>
  )
}

export default Upload

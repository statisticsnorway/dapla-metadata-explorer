import React, { useContext, useEffect } from 'react'
import useAxios from 'axios-hooks'
import { Icon, List } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext } from '../../context/AppContext'
import { API } from '../../configurations'

function Upload ({ name, file }) {
  const { ldsApi } = useContext(ApiContext)

  const [{ loading, error, response }, retry] = useAxios(file[2] === 'single' ? {
    url: `${ldsApi}/ns/${file[0]}/${file[1].id}`,
    method: 'PUT'
  } : {
    url: `${ldsApi}${API.PUT_DOMAIN_INSTANCES_DATA}`,
    method: 'PUT'
  }, { manual: true })

  useEffect(() => {
    retry({ data: file[1] }).then()
    // eslint-disable-next-line
  }, [])

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
          {error &&
          <Icon link name='redo' onClick={() => retry} style={{ color: SSB_COLORS.BLUE, marginLeft: '0.3em' }} />
          }
        </List.Description>
      </List.Content>
    </List.Item>
  )
}

export default Upload

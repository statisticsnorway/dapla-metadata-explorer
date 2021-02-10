import { useContext, useState } from 'react'
import useAxios from 'axios-hooks'
import { Button, Icon } from 'semantic-ui-react'
import { LANGUAGE, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext, SchemasContext } from '../../context/AppContext'
import { formatFilename, getDomainRef } from '../../utilities'
import { API } from '../../configurations'
import { DOMAINS } from '../../enums'

let JSZip = require('jszip')

const isReadOnlyAPI = api => api ? API.LDS[0] : API.LDS[1]

function DomainsJsonData () {
  const { apiReadOnly, ldsApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)
  const { schemas } = useContext(SchemasContext)

  const [domainNames] = useState(
    Object.entries(schemas.groups).reduce(
      (accumulator, [group, schemasByGroup]) => {
        if (schemasByGroup.length !== 0) {
          accumulator = accumulator.concat(schemasByGroup.map(schema => getDomainRef(schema)))
        }
        return accumulator
      }, []
    )
  )

  const [{ loading }, refetch] = useAxios('', { manual: true, useCache: false })

  const handleButtonClicked = async () => {
    const time = new Date().toLocaleTimeString(LANGUAGE.LOCALE[language])
    const date = new Date().toLocaleDateString(LANGUAGE.LOCALE[language])

    let zip = new JSZip()

    for await (let domain of domainNames) {
      try {
        const response = await refetch({ url: `${ldsApi}/ns/${domain}` })

        if (response.status === 200) {
          const jsonFilename = `${domain}_all_${formatFilename(date, time, language)}.json`
          const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'text/json;charset=utf-8;' })

          zip.file(jsonFilename, blob)
        }
      } catch (e) {
        console.log(e)
      }
    }

    zip.generateAsync({ type: 'blob' }).then((blobData) => {
      let zipBlob = new Blob([blobData])

      const link = document.createElement('a')
      const url = URL.createObjectURL(zipBlob)
      const zipFilename = `${isReadOnlyAPI(apiReadOnly).replace(' ', '-')}_all_${formatFilename(date, time, language)}.zip`

      link.setAttribute('href', url)
      link.setAttribute('download', zipFilename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <Button
      size='large'
      type='button'
      loading={loading}
      disabled={loading}
      onClick={() => handleButtonClicked()}
      style={{ backgroundColor: SSB_COLORS.PURPLE }}
    >
      <Icon name='download' style={{ paddingRight: '0.5rem' }} />
      {DOMAINS.GET_ZIP[language]}
    </Button>
  )
}

export default DomainsJsonData

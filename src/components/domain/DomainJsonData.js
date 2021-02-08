import React, { useContext } from 'react'
import { Button, Icon } from 'semantic-ui-react'

import { ApiContext, LanguageContext } from '../../context/AppContext'
import { DOMAIN } from '../../enums'
import { LANGUAGE, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

function DomainJsonData ({ rawData, domain }) {
  const { apiReadOnly } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const formatFilename = (date, time) => {
    const formatFixer = {
      date: {
        en: (filenameDate) => filenameDate.replace(/\//g, '-'),
        nb: (filenameDate) => filenameDate.replace(/./g, '-')
      },
      time: {
        en: (filenameTime) => filenameTime.split(':').slice(0, 2).join('-'),
        nb: (filenameTime) => filenameTime.split(':').slice(0, 2).join('-')
      }
    }

    return formatFixer.date[language](date) + '_' + formatFixer.time[language](time)
  }

  const downloadJson = () => {
    if (!apiReadOnly) {
      const time = new Date().toLocaleTimeString(LANGUAGE.LOCALE[language])
      const date = new Date().toLocaleDateString(LANGUAGE.LOCALE[language])
      const filename = `${domain}_all_${formatFilename(date, time)}.json`
      const blob = new Blob([JSON.stringify(rawData, null, 2)], { type: 'text/json;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Button
      size='large'
      type='button'
      onClick={() => downloadJson()}
      style={{ backgroundColor: SSB_COLORS.PURPLE }}
    >
      <Icon name='download' style={{ paddingRight: '0.5rem' }} />
      {DOMAIN.GET_JSON[language]}
    </Button>
  )
}

export default DomainJsonData

export const camelToTitle = string => {
  const toTitle = string.split(/(?=[A-Z])/).join(' ')

  return toTitle.charAt(0).toUpperCase() + toTitle.slice(1)
}

export const convertDateToView = value => {
  const date = new Date(value)

  return date.toLocaleDateString()
}

export const capitalize = string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

export const deCapitalize = string => `${string.charAt(0).toLowerCase()}${string.slice(1)}`

export const formatFilename = (date, time, language) => {
  const formatFixer = {
    date: {
      en: (filenameDate) => filenameDate.replace(/\//g, '-'),
      nb: (filenameDate) => filenameDate.replace(/\./g, '-')
    },
    time: {
      en: (filenameTime) => filenameTime.split(':').slice(0, 2).join('-'),
      nb: (filenameTime) => filenameTime.split(':').slice(0, 2).join('-')
    }
  }

  return formatFixer.date[language](date) + '_' + formatFixer.time[language](time)
}

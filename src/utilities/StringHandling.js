export const camelToTitle = string => {
  const toTitle = string.split(/(?=[A-Z])/).join(' ')

  return toTitle.charAt(0).toUpperCase() + toTitle.slice(1)
}

export const convertDateToView = value => {
  const date = new Date(value)

  return date.toLocaleDateString()
}

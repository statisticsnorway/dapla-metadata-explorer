export const convertDateToView = value => {
  try {
    const date = new Date(value)

    return date.toLocaleDateString()
  } catch (e) {
    console.log(e)

    return value
  }
}

export const truncateString = (string, length = 32) => {
  if (typeof string === 'string') {
    return string.length > length ? string.substring(0, (length - 2)) + '...' : string
  } else {
    return '...'
  }
}

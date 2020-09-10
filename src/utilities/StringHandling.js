export const convertDateToView = value => {
  const date = new Date(value)

  return date.toLocaleDateString()
}

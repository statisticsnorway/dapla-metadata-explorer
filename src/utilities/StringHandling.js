export const convertDateToView = value => {
  try {
    const date = new Date(value)

    return date.toLocaleDateString()
  } catch (e) {
    console.log(e)

    return value
  }
}

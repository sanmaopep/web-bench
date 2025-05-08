export const formatModelName = (model?: string): string | undefined => {
  return model ? model.replace('/', '-') : undefined
}

export const formatEndpoint = (endpoint?: string): string | undefined => {
  if (!endpoint) {
    return
  }

  const names: string[] = []

  const url = new URL(endpoint)
  names.push(url.host.replace(/:/g, '-'))
  names.push(url.pathname.replace(/\//g, '-'))

  return names.join('-')
}

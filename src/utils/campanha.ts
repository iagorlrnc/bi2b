export const getCampanhaUrl = () => {
  const host = window.location.hostname.replace(/^www\./, "")
  const port = window.location.port ? `:${window.location.port}` : ""
  return `${window.location.protocol}//abrirminhaempresa.${host}${port}`
}

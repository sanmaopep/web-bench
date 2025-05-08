console.log('log')

fetch(`/postman/get?text=hello%20proxy`).then(async response => {
  const json = await response.json()
  const fetchNode = document.createElement('div')
  document.body.appendChild(fetchNode)
  fetchNode.textContent = json.args.text
})

fetch(`/mock-api/ping`).then(async response => {
  const json = await response.json()
  const mockGetNode = document.createElement('div')
  document.body.appendChild(mockGetNode)
  mockGetNode.textContent = `hello ${json.data}`
})

const helloNode = document.createElement('div')
helloNode.textContent = 'hello world'
document.body.appendChild(helloNode)

const obj = {}
const optionalChainingNode = document.createElement('div')
optionalChainingNode.textContent = obj?.field || 'fallback'
document.body.appendChild(optionalChainingNode)
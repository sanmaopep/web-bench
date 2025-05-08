const versionElement = document.createElement('div')
versionElement.textContent = `hello ${process.env.__VERSION__}`
document.body.appendChild(versionElement)
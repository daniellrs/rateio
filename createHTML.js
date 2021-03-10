const fs = require('fs')
const curso = require('./curso-processado.json')

console.time('Processo')

const totais = (() => {
  const modulos = curso.modulos.length
  let aulas = 0
  let videos = 0
  curso.modulos.forEach(modulo => (aulas += modulo.aulas.length))
  curso.modulos.forEach(modulo =>
    modulo.aulas.forEach(aula => (videos += aula.videos.length))
  )
  return { modulos, aulas, videos }
})()

let html = `
<h1>${curso.titulo}</h1>
<p style="color: #888; font-size: 14px">${totais.modulos} módulos, ${totais.aulas} aulas, ${totais.videos} vídeos, ${curso.durationP}</p>
`

curso.modulos.forEach((modulo, index) => {
  const totais = (() => {
    const aulas = modulo.aulas.length
    let videos = 0
    modulo.aulas.forEach(aula => (videos += aula.videos.length))
    return { aulas, videos }
  })()

  html += `
    <br />
    <p style="font-size: 18px; font-weight: 600">${index + 1}. ${
    modulo.titulo
  }</p>
    <p style="color: #888; font-size: 14px">${totais.aulas} aulas, ${
    totais.videos
  } vídeos, ${modulo.durationP}</p>
  `

  modulo.aulas.forEach((aula, index) => {
    const totais = (() => {
      let videos = aula.videos.length
      return { videos }
    })()

    html += `
      <br />
      <p style="font-size: 14px; font-weight: 600; color: #45818e">${aula.titulo}</p>
      <p style="color: #333; font-size: 14px">${aula.conteudo}</p>
      <p style="color: #888; font-size: 14px">${totais.videos} vídeos, ${aula.durationP}</p><br />
    `

    aula.videos.forEach((video, index) => {
      html += `
        <p>${index + 1}. ${
        video.titulo
      } <span style="color: #888; font-size: 13px">(${
        video.durationP
      })</span></p>
      `
    })
  })
})

fs.writeFile(`curso.html`, html, err => {
  if (err) {
    reject()
    throw err
  }

  console.timeLog('Processo', 'finalizado -> curso.html')
})

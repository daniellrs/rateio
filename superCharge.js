const fs = require('fs')
const { getVideoDurationInSeconds } = require('get-video-duration')
const curso = require('./curso-processado.json')

const processDuration = duration => {
  if (duration === 0) return ''

  if (duration >= 86400) {
    const dias = parseInt(duration / 86400, 10)
    return `${dias} dia${dias > 1 ? 's' : ''} ${processDuration(
      duration % 86400
    )}`
  }

  if (duration >= 3600) {
    const horas = parseInt(duration / 3600, 10)
    return `${horas} hora${horas > 1 ? 's' : ''} ${processDuration(
      duration % 3600
    )}`
  }

  if (duration >= 60) {
    const minutos = parseInt(duration / 60, 10)
    return `${minutos} minuto${minutos > 1 ? 's' : ''} ${processDuration(
      duration % 60
    )}`
  }

  const segundos = parseInt(duration, 10)
  return `${segundos} segundo${segundos > 1 ? 's' : ''}`
}

const loadTempoVideo = async video => {
  const duration = await getVideoDurationInSeconds(video.link)
  video.duration = duration
}

const propagaTempoVideos = curso => {
  let durationCurso = 0

  for (const modulo of curso.modulos) {
    let tempoModulo = 0

    for (const aula of modulo.aulas) {
      let durationAula = 0

      for (const video of aula.videos) {
        durationAula += video.duration || 0
        video.durationP = processDuration(video.duration)
      }

      tempoModulo += durationAula
      aula.duration = durationAula
      aula.durationP = processDuration(durationAula)
    }

    durationCurso += tempoModulo
    modulo.duration = tempoModulo
    modulo.durationP = processDuration(tempoModulo)
  }

  curso.duration = durationCurso
  curso.durationP = processDuration(durationCurso)
}

const saveToFile = (backup, finished) =>
  fs.writeFile(
    `curso-processado${backup ? '-supercharged' : ''}.json`,
    JSON.stringify(curso, null, 2),
    err => {
      if (err) {
        reject()
        throw err
      }

      if (finished)
        console.timeLog('Processo', 'finalizado -> curso-supercharged.json')
    }
  )

const lazyLoadModulos = async () => {
  console.time('Processo')

  for (const modulo of curso.modulos) {
    console.log('Processando módulo', modulo.titulo)

    for (const aula of modulo.aulas) {
      if (aula.supercharged) continue
      for (const video of aula.videos) {
        console.log('Processando video', video.titulo)
        await loadTempoVideo(video)
      }

      aula.supercharged = true
      console.log('Salvo.')
      saveToFile(true, false)
      saveToFile(false, false)
    }
  }

  propagaTempoVideos(curso)
  saveToFile(true, false)
  saveToFile(false, true)
}

lazyLoadModulos()

// const { https } = require('follow-redirects')
// console.log('Processando PDF', aula.titulo)
// await loadLinkPDF(aula)
// const loadLinkPDF = aula => {
//   if (!aula.pdf) return
//   return new Promise(resolve => {
//     https.get(aula.pdf, response => {
//       aula.pdf = response.responseUrl
//       resolve()
//     })
//   })
// }

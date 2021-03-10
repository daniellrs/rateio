const fs = require('fs')
const axios = require('axios')
const curso = require('./curso.json')

const instance = axios.create({
  baseURL: 'https://api.estrategiaconcursos.com.br/api/aluno/curso/',
  headers: {
    authorization:
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiZTQ3ZTgyMGNhNzgyMmFkMTU4ZmQ3ZjJkN2VkOGY0ZTQ2MTgxM2EzZGM3NDA1Zjg3MDRkNzIyN2ZjNTM4OTQyOWNiNWM2YzJhNTYwODVkYzYiLCJpYXQiOjE2MTI5MjUxNzUsIm5iZiI6MTYxMjkyNTE3NSwiZXhwIjoxNjQ0NDYxMTc1LCJzdWIiOiIxNjk3MTY2Iiwic2NvcGVzIjpbXX0.SnhL7xu_rydhMPbVabDRebGeDkUTuTiTEh6VPMHD-sonaTKcp_3P1YUotm3jSYe-TVFNlrJu-_sRycg_aYPQ28ydo_7n99sw5PkgXXmQtin3mLyubIfTSfA5ki6YDXbquir3Fae8-2cbSI93YDaX6AXheB34VOeRPgl9_HPdRy8OPXNFl9GL_c8m7nzBwdnaCTj1nzAPkDIyu1ewobZrKX49exa9F28GhOBj49XMX1ymvEueuncVBArhAufugralDFSTBJKlSnAWcaN-f7-AF8INMjptddXjdrNYjumdYTZjO50BxFobeK1Rh0rKBs5xoSid2g1Qsx3RdlPQfjMWmlm8lDfWvuFxilqSf7f6REiZ-OGuldTIQth-4QR6kVLBzM635dHgeLDV-aC5-eyQJ2P7rcyLPFOcF0I2j6y-xP-sQcZ3uJwFP5QJ2QDLTpcq6z7fatWDea1sbw7wd16sJpsp2pr-ce2TUF-TQn3E5xpKE-j_zcy1rMLUZmuMvHN5GQBteWi0KBgr6xRPQxsiPtu-_Wfu7Nt7RYErfBVwAdcrixfDGLMgGoQW71I-mCB7UkzEjtbRPGc7lWEpCYFO0aiwOibsu2fn6lAl-IcpmmRHAi5fMZ7e2ZKQ6mk3_0fzffUl_i2YzugCNNrcJwe2JhdfohJByXQFzZSerPk2QdI',
  },
})

const loadModulo = async modulo => {
  const {
    data: { data },
  } = await instance.get(modulo.codigo)

  modulo.aulas = data.aulas.map(aula => ({
    codigo: aula.id,
    titulo: aula.nome,
    conteudo: aula.conteudo,
    pdf: aula.pdf,
    videos: aula.videos.map(video => ({
      titulo: video.titulo,
      link: video.resolucoes[video.resolucao],
    })),
  }))
}

const lazyLoadModulos = async () => {
  console.time('Processo')

  for (const modulo of curso.modulos) {
    console.log('Processando módulo', modulo.titulo)
    await loadModulo(modulo)
    await sleep(2000)
  }

  saveToFile(true)
  saveToFile(false)
}

const saveToFile = backup =>
  fs.writeFile(
    `curso-processado${backup ? '-raw' : ''}.json`,
    JSON.stringify(curso, null, 2),
    err => {
      if (err) {
        throw err
      }

      if (!backup)
        console.timeLog('Processo', 'finalizado -> curso-processado.json')
    }
  )

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

lazyLoadModulos()

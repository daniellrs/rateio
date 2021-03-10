const fs = require('fs')
const axios = require('axios')
const curso = require('./curso-processado.json')

const instance = axios.create({
  baseURL: 'https://api.estrategiaconcursos.com.br/api/aluno/curso/',
  headers: {
    authorization:
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiMGU3NGM1YTNmODdmMWM4MjBiNGU0MDBhOTg3ZjA0YWU5ZTdlOWU0Y2RhMWZhZjgyY2IxM2RmMTkyYmJkOTlhYTVhYzRmOWZjOTMxNjAyMjMiLCJpYXQiOjE2MTI5NTg0NDEsIm5iZiI6MTYxMjk1ODQ0MSwiZXhwIjoxNjQ0NDk0NDQxLCJzdWIiOiIxNjk3MTY2Iiwic2NvcGVzIjpbXX0.i_gZmm_iFjW8ZwODRRbUavlfFtEQ-oGADf2PZTjmJcKp7EtrbfxbVYhBDy8gCboUulN0PwGRxB3TVMqT2sW2pDA-fss6ZNgNYWJwaDSRRn0bQtYvaRHF3XH4TEJOeEKojRGrw1vHeyFxa_-TbmCY-f_gGO0G2y84KW2SZf1_LRK4jxOOwRul-AAMw-lbk_Ckkjrfk_4G6hAy8XhIAGfo_av2nKVGZ437-AxcG0Bx6TVIFE2t3RY_-W1VLehRwXsfgDuiR_sou7xA-z1iSoEc-aQte50kv9AZb98HqcYxeW3sZkp7y08qIREgoPiZAAMWChsGAKO16d2iQxtqkLQ7EF0bEKPCVTwmInoKGPzjevm_r5Y3CBa8qFVbrQOH55mDeEKvyLbBUwhZq_KxMcklM_8cljKRugACO5kzMDl_Flm9x9haRUS8OtXJh9-LKJeXhKWMCLIpKAMaV3V4eVPfc9NTLtF-ArYsFORuup00Za1T3OBIwgZ3mPAqj_CcrGaH57XTOnk8uDXv01Xhe0VRVaRye5OV2DsyB9EbGMUHlfPWVXMYq-CXKgzvnEcRtko79LVfMLWFdHMo6BCDfo9oTJLvB8EaojFxOs7o412aQLf0WmBEYZaSsEv6BVGeI1MpWVENwdG7KWq3pGjxJCHIOBf6CCzAPPSG2l5dubPifCs',
  },
})

const loadModulo = async modulo => {
  const {
    data: { data },
  } = await instance.get(modulo.codigo)

  modulo.aulas = data.aulas.map((aula, index) => {
    const _aula = modulo.aulas.find((_, i) => i === index)

    return {
      ..._aula,
      pdf: aula.pdf,
      videos: aula.videos.map((video, index) => {
        const _video = _aula.videos.find((_, i) => i === index)

        return {
          ..._video,
          link: video.resolucoes[video.resolucao],
        }
      }),
    }
  })
}

const lazyLoadModulos = async () => {
  console.time('Processo')

  for (const modulo of curso.modulos) {
    console.log('Processando módulo', modulo.titulo)
    await loadModulo(modulo)
    await sleep(2000)
  }

  saveToFile()
}

const saveToFile = () =>
  fs.writeFile(`curso-processado.json`, JSON.stringify(curso, null, 2), err => {
    if (err) {
      reject()
      throw err
    }

    console.timeLog('Processo', 'finalizado -> curso-processado.json')
  })

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

lazyLoadModulos()

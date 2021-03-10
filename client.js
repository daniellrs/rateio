const _cursos = []

const cursos = document.querySelectorAll('.TabPanel')

cursos.forEach(curso => {
  const _modulos = []
  const titulo = curso.querySelector('h2').innerText
  const modulos = curso.querySelectorAll('section')

  modulos.forEach(modulo => {
    const titulo = modulo.querySelector('h1').innerText
    const link = modulo.querySelector('a').href
    const codigo = link.substring(
      link.indexOf('cursos/') + 7,
      link.indexOf('/aulas')
    )

    _modulos.push({
      titulo,
      link,
      codigo,
    })
  })

  _cursos.push({
    titulo,
    modulos: _modulos,
  })
})

console.log(_cursos)

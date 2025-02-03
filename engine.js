document.getElementById("sheetjsexport").addEventListener('click', function () {
  var wb = XLSX.utils.table_to_book(document.getElementById("TableToExport"))
  XLSX.writeFile(wb, "Relatório.xlsx")
});

const peso = document.getElementById('peso')

function data() {
  const date = new Date()
  const dia = date.getDate().toString().padStart(2, "0")
  const mes = (date.getMonth() + 1).toString().padStart(2, "0")
  const ano = date.getFullYear()

  return `${dia}/${mes}/${ano}`
}

let almocoSelecionado = 'Sim'
document.querySelectorAll('input[name="almoco"]').forEach(radio => {
  radio.addEventListener("change", () => almocoSelecionado = radio.value)
})

let jantarSelecionado = 'Sim'
document.querySelectorAll('input[name="jantar"]').forEach(radio => {
  radio.addEventListener("change", () => jantarSelecionado = radio.value)
})

let besteiraSelecionado = 'Não'
document.querySelectorAll('input[name="besteira"]').forEach(radio => {
  radio.addEventListener("change", () => besteiraSelecionado = radio.value)
})

let faseMenstrauacaoSelecionado = 'Normal'
document.querySelectorAll('input[name="menstruacao"]').forEach(radio => {
  radio.addEventListener("change", () => faseMenstrauacaoSelecionado = radio.value)
})

function CreateBtnRemover(local) {
  const CreateTDAcoes = document.createElement('td')
  const createBtnRemover = document.createElement('button')
  createBtnRemover.classList.add('btnRemover')
  createBtnRemover.innerHTML = '❌'

  CreateTDAcoes.appendChild(createBtnRemover)

  local.appendChild(CreateTDAcoes)
}

document.querySelector('table').addEventListener('click', function (event) {
  if (event.target.classList.contains('btnRemover')) {
    Remover(event.target.closest('tr'))
  }
})

function Remover(linha) {
  if (confirm('Tem certeza que deseja remover esta linha?')) {
    linha.remove()
  }
}

function CreateTD(local, text) {
  const CreateTD = document.createElement('td')
  CreateTD.innerText = text
  local.appendChild(CreateTD)
}

function Gerar() {
  const pesoValor = parseFloat(peso.value)
  if (peso.value === '') {
    alert('Por favor, insira um valor para o peso!')
  } else if (isNaN(pesoValor) || pesoValor < 50 || pesoValor > 150) {
    alert('O peso deve estar entre 30 e 150 Kg!')
  } else {
    const tBody = document.querySelector('tbody.res')
    const dataAtual = data()

    let dataExistente = false
    document.querySelectorAll('.informacoes').forEach(row => {
      if(row.children[0].textContent === dataAtual) {
        dataExistente = true
      }
    })

    if(dataExistente) {
      alert('Já existe uma entrada para esta data!')
      return
    }

    const createTR = document.createElement('tr')
    createTR.classList.add('informacoes')
    tBody.appendChild(createTR)
    CreateTD(createTR, data())
    CreateTD(createTR, almocoSelecionado)
    CreateTD(createTR, jantarSelecionado)
    CreateTD(createTR, besteiraSelecionado)
    CreateTD(createTR, faseMenstrauacaoSelecionado)
    CreateTD(createTR, `${peso.value} Kg`)
    CreateBtnRemover(createTR)
    peso.value = ''
    peso.focus()
  }
}

peso.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const btnConcluir = document.getElementById('concluir')
    event.preventDefault()
    btnConcluir.click()
  }
})

function save() {
  const result = []
  document.querySelectorAll('.informacoes').forEach(row => {
    const rowData = []
    row.querySelectorAll('td').forEach(td => {
      if (!td.querySelector('.btnRemover')) {
        rowData.push(td.textContent)
      }
    })
    result.push(rowData)
  })
  localStorage.setItem('informacoes', JSON.stringify(result))
}

function loadresults() {
  const result = JSON.parse(localStorage.getItem('informacoes')) || []
  const tBody = document.querySelector('tbody.res')

  document.querySelectorAll('.informacoes').forEach(row => row.remove())

  result.forEach(rowData => {
    const createTR = document.createElement('tr')
    createTR.classList.add('informacoes')

    rowData.forEach(text => {
      CreateTD(createTR, text)
    })

    CreateBtnRemover(createTR)
    tBody.appendChild(createTR)
  })
}

window.addEventListener('beforeunload', save)
window.addEventListener('DOMContentLoaded', loadresults)
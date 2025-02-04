import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js'
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyCYL6yOY9EyHLYMsPK6QkPe4fIVmBJgHxg",
  authDomain: "form-project-f9370.firebaseapp.com",
  projectId: "form-project-f9370",
  storageBucket: "form-project-f9370.appspot.com",
  messagingSenderId: "1024202706941",
  appId: "1:1024202706941:web:d23861d0cceb3a216e1394"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

document.getElementById("sheetjsexport").addEventListener('click', function () {
  var wb = XLSX.utils.table_to_book(document.getElementById("TableToExport"))
  XLSX.writeFile(wb, "Relatório.xlsx")
})

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

async function Remover(linha) {
  if (confirm('Tem certeza que deseja remover esta linha?')) {
    const data = linha.children[0].textContent
    const idDocumento = data.replace(/\//g, "-")

    try {
      await deleteDoc(doc(db, "registros", idDocumento))
      linha.remove()
    } catch (error) {
      console.error("Erro ao remover o documento:", error)
    }
  }
}

function CreateTD(local, text) {
  const CreateTD = document.createElement('td')
  CreateTD.innerText = text
  local.appendChild(CreateTD)
}

function Gerar() {
  const pesoValor = parseFloat(document.getElementById('peso').value)
  if (!pesoValor) {
    alert('Por favor, insira um valor para o peso!')
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
  }
}

async function salvarDados() {
  const dataAtual = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")
  const pesoValor = parseFloat(document.getElementById('peso').value)

  const dados = {
    data: dataAtual,
    almoco: almocoSelecionado,
    jantar: jantarSelecionado,
    besteira: besteiraSelecionado,
    menstruacao: faseMenstrauacaoSelecionado,
    peso: `${pesoValor} Kg`
  }

  try {
    await setDoc(doc(collection(db, "registros"), dataAtual), dados)
    console.log("Dados salvos com sucesso!")
    alert("Dados salvos com sucesso!")
  } catch (error) {
    console.error("Erro ao salvar os dados:", error)
  }
}


async function carregarDados() {
  const tBody = document.querySelector('tbody.res')
  tBody.innerHTML = ''

  try {
  const querySnapshot = await getDocs(collection(db, "registros"))

    querySnapshot.forEach((doc) => {
      const dados = doc.data()

      const createTR = document.createElement('tr')
      createTR.classList.add('informacoes')

      CreateTD(createTR, dados.data)
      CreateTD(createTR, dados.almoco)
      CreateTD(createTR, dados.jantar)
      CreateTD(createTR, dados.besteira)
      CreateTD(createTR, dados.menstruacao)
      CreateTD(createTR, dados.peso)
      CreateBtnRemover(createTR)

      tBody.appendChild(createTR)
    })

  } catch (error) {
      console.error("Erro ao carregar os dados:", error)
  }
}

document.getElementById('peso').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const btnConcluir = document.getElementById('btnGerar')
    event.preventDefault()
    btnConcluir.click()
  }
})

document.getElementById("btnGerar").addEventListener("click", () => {
  const pesoValor = parseFloat(document.getElementById('peso').value)
  if (!pesoValor) {
    alert('Por favor, insira um valor para o peso!')
    return
  }

  let dataExistente = false
  const dataAtual = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")

  document.querySelectorAll('.informacoes').forEach(row => {
    if (row.children[0].textContent === dataAtual) {
      dataExistente = true
    }
  });

  if (dataExistente) {
    alert('Já existe uma entrada para esta data!')
    return
  }

  Gerar()
  salvarDados()
  document.getElementById('peso').value = ''
  document.getElementById('peso').focus()
});

document.addEventListener("DOMContentLoaded", carregarDados)
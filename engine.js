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

document.querySelector('table').addEventListener('click', function (event) {
  if (event.target.classList.contains('btnRemover')) {
    Remover(event.target.closest('tr'))
  }
})

document.querySelector('table').addEventListener('click', function (event) {
  if (event.target.classList.contains('btnEditar')) {
    alert('Epa Epa, botão não implementado ainda!')
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

function dataAtual() {
  const dataAtual = new Date().toLocaleDateString("pt-BR")
  return dataAtual
}

let datainput = ''
const date = document.querySelector('#date')
date.addEventListener('change', function () {
  const date = new Date(this.value + 'T00:00:00')
  datainput = date.toLocaleDateString('pt-BR').replace(/\//g, "-")
  console.log(datainput)
})

function Gerar() {
  const pesoValor = parseFloat(document.getElementById('peso').value)
  const tBody = document.querySelector('tbody.res')
    
    tBody.innerHTML += `<tr class="informacoes">
                          <td>${datainput}</td>
                          <td>${almocoSelecionado}</td>
                          <td>${jantarSelecionado}</td>
                          <td>${besteiraSelecionado}</td>
                          <td>${faseMenstrauacaoSelecionado}</td>
                          <td>${pesoValor} Kg</td>
                          <td>
                            <button class="btnEditar">✏️</button>
                            <button class="btnRemover">❌</button>
                          </td>
                      </tr>`
}

async function salvarDados() {
  // const dataAtual = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")
  const pesoValor = parseFloat(document.getElementById('peso').value)

  const dados = {
    data: datainput,
    almoco: almocoSelecionado,
    jantar: jantarSelecionado,
    besteira: besteiraSelecionado,
    menstruacao: faseMenstrauacaoSelecionado,
    peso: pesoValor,
  }

  try {
    await setDoc(doc(collection(db, "registros"), datainput), dados)
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

      tBody.innerHTML += `<tr class="informacoes">
                          <td>${dados.data.replace(/-/g, "/")}</td>
                          <td>${dados.almoco}</td>
                          <td>${dados.jantar}</td>
                          <td>${dados.besteira}</td>
                          <td>${dados.menstruacao}</td>
                          <td>${dados.peso} Kg</td>
                          <td>
                            <button class="btnEditar">✏️</button>
                            <button class="btnRemover">❌</button>
                          </td>
                      </tr>`
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

  if(datainput === ''){
    alert('Por favor, insira uma data!')
    return
  }

  let dataExistente = false
  document.querySelectorAll('.informacoes').forEach(row => {
    if (row.children[0].textContent === dataAtual()) {
      dataExistente = true
    }
  })

  if (dataExistente) {
    alert('Já existe uma entrada para esta data!')
    return
  }

  Gerar()
  salvarDados()
  carregarDados()
  document.getElementById('peso').value = ''
  document.getElementById('peso').focus()
})

document.addEventListener("DOMContentLoaded", carregarDados)
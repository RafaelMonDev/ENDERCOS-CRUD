const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sCep = document.querySelector('#m-cep')
const sRua = document.querySelector('#m-rua')
const sNumero = document.querySelector('#m-numero')
const sBairro = document.querySelector('#m-bairro')
const sCidade = document.querySelector('#m-cidade')
const btnSalvar = document.querySelector('#btnSalvar')
const btnConsultar = document.querySelector('#btnConsultar')

let itens
let id

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [] //Pegar itens do banco através do getiten
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens)) //Setar os itens da variável para dentro do banco

//Funcão a ser executada assim que a tela for carregado para carregar os itens na tela
function loadItens() {
    itens = getItensBD()
    tbody.innerHTML = ''
    itens.forEach((item, index) => {
        insertItem(item, index)
    })
}

loadItens()

function editItem(index) { //edição através da função openModal carregando os dados nos campos
    
    openModal(true, index)
}

function deleteItem(index) { // excluir o item
    itens.splice(index, 1)
    setItensBD()
    loadItens()
}

function openModal(edit = false, index = 0){ // Essa função ativa o form dos campos verificando se é uma edição ou não carregando os campos de acordo com a situação
    
    modal.classList.add('active')

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1 ) {
            modal.classList.remove('active')
        }
    }

    if (edit) {      
        sCep.value = itens[index].cep  
        sRua.value = itens[index].rua
        sNumero.value = itens[index].numero
        sBairro.value = itens[index].bairro
        sCidade.value = itens[index].cidade
        
        id = index
    } else {      
        limpaCampos()
    }
    
}

function consultaEndereco() {                 //Consome a API busando o cep inserido no campo utilizando a url disponibilizada pela mesma.
    let cep = document.querySelector('#m-cep').value;


    if (cep.length !== 9) {
        alert('CEP inválido');
        return;
    }

    let url = `https://viacep.com.br/ws/${cep}/json/`;
    fetch(url).then(function(response){
        response.json().then(mostrarEndereço)       
        
    });
}   

function mostrarEndereço(dados) {               //Insere os resutados do objeto retornado pela API no model para vizualização.
    
    if (dados.erro) {
        alert("Não foi possível localizar o endereço!")
    }else{
        sRua.value = `${dados.logradouro}`    
        sBairro.value = `${dados.bairro}`
        sCidade.value = `${dados.localidade}`
        console.log(dados)
    }            
}

function insertItem(item, index) { //Insere os itens na tabela, inclusive os botões de editar e excluir
    let tr = document.createElement('tr')

    tr.innerHTML = `
        
        <td>${item.rua}</td>
        <td>${item.numero}</td>
        <td>${item.bairro}</td>
        <td>${item.cidade}</td>
        <td>${item.cep}</td>
        <td class="acao">
            <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteItem(${index})"><i class='bx bx-trash' ></i></button>
        </td>
    `
    tbody.appendChild(tr)
}

btnSalvar.onclick = e => { //Salva os dados dos itens no array designando o campo para o item no banco de acordo com o item

    if (sRua.value == '' || sBairro.value == '' || sCidade.value == '') { // verifica se os campos estão preenchidos
        return
    }

    e.preventDefault();

    if (id !== undefined) {
        
        itens[id].rua = sRua.value
        itens[id].numero = sNumero.value
        itens[id].bairro = sBairro.value
        itens[id].cidade = sCidade.value
        itens[id].cep = sCep.value
    } else {
        itens.push({'rua': sRua.value, 'numero': sNumero.value, 'bairro': sBairro.value, 'cidade': sCidade.value, 'cep': sCep.value})        
    }

    setItensBD()
    
    modal.classList.remove('active')
    loadItens()
    limpaCampos()
    id = undefined
}

function limpaCampos(){
    sRua.value = ''
    sNumero.value = ''
    sBairro.value = ''
    sCidade.value = ''
    sCep.value = ''
}
const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sCep = document.querySelector('#m-cep')
const sRua = document.querySelector('#m-rua')
const sNumero = document.querySelector('#m-numero')
const sBairro = document.querySelector('#m-bairro')
const sCidade = document.querySelector('#m-cidade')
const sUf = document.querySelector('#m-uf')
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
        sUf.value = itens[index].uf
        
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
        sUf.value = `${dados.uf}`
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
        <td>${item.uf}</td>
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
        itens[id].uf = sUf.value
        itens[id].cep = sCep.value
    } else {
        itens.push({'rua': sRua.value, 'numero': sNumero.value, 'bairro': sBairro.value, 'cidade': sCidade.value, 'uf': sUf.value, 'cep': sCep.value})        
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
    sUf.value = ''
    sCep.value = ''
}
// Função para ordenar a tabela quando um cabeçalho da coluna é clicado
function sortTable(colIndex) {
    // Array com os índices das colunas correspondentes a cidade, bairro e estado
    var sortableColumns = [3, 2, 4]; // Índices baseados na ordem dos cabeçalhos
    
    // Verificar se o índice da coluna está na lista de colunas ordenáveis
    if (sortableColumns.includes(colIndex)) {
      // Variáveis para manipulação da tabela
      var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
      // Obter a referência da tabela pelo ID
      table = document.getElementById("myTable");
      // Definir a direção inicial da ordenação como ascendente
      dir = "asc"; 
      // Loop principal para ordenar a tabela
      switching = true;
      while (switching) {
        switching = false;
        // Obter todas as linhas da tabela
        rows = table.rows;
        // Loop pelas linhas (excluindo a primeira, que contém os cabeçalhos)
        for (i = 1; i < (rows.length - 1); i++) {
          shouldSwitch = false;
          // Obter os elementos das células nas colunas atual e próxima
          x = rows[i].getElementsByTagName("td")[colIndex];
          y = rows[i + 1].getElementsByTagName("td")[colIndex];
          // Verificar se as linhas devem trocar de posição com base na direção de ordenação
          if (dir == "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          } else if (dir == "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          }
        }
        if (shouldSwitch) {
          // Trocar as linhas de posição
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          // Incrementar a contagem de trocas
          switchcount++; 
        } else {
          // Inverter a direção de ordenação se nenhuma troca foi feita e a direção atual é ascendente
          if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
          }
        }
      }
    }
  }
  